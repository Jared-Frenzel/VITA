require(['jquery'], function($) {
	$(document).ready(function() {
		loadProfileInformation();
		loadAbilities();
		loadRoles();
		loadShifts();

		initializeEventListeners();
	});

	function loadProfileInformation() {
		$.ajax({
			url: "/server/profile/profile.php",
			type: "GET",
			dataType: "JSON",
			data: {
				action: 'getUserInformation'
			},
			cache: false,
			success: function(response) {
				$("#firstNameText").html(response.firstName);
				$("#lastNameText").html(response.lastName);
				$("#emailText").html(response.email);
				$("#phoneNumberText").html(response.phoneNumber);
			},
			error: function(response) {
				alert("Unable to load information. Please refresh the page in a few minutes.");
			}
		});
	};

	function loadAbilities() {
		$.ajax({
			url: "/server/profile/profile.php",
			type: "GET",
			dataType: "JSON",
			data: {
				action: 'getAbilities'
			},
			cache: false,
			success: function(response) {
				$("#abilitiesEditButton").show();
				$("#abilitiesCancelButton").hide()
				$('#abilitiesSelect').empty();
				for (let i = 0; i < response.abilities.length; i++) {
					let ability = response.abilities[i];
					let modifiers = ability.has ? `data-userAbilityId=${ability.userAbilityId} checked` : '';
					let checkbox = $(`<input id=${i} type="checkbox" value=${ability.abilityId} ${modifiers} />`);
					let editLabel = $(`<label for=${i}>${ability.name}</label>`);
					let editContainer = $(`<div style="display:none;"></div>`).addClass("editView");
					editContainer.append(checkbox, editLabel);
					let status = $(`<span aria-hidden="true"></span>`).addClass(ability.has ? "wdn-icon-ok green-icon" : "wdn-icon-cancel red-icon");
					let label = $(`<label>${ability.name}</label>`);
					let container = $(`<div></div>`).addClass("preview");
					container.append(status, label);
					$('#abilitiesSelect').append(editContainer, container);
				}

				$('#certificationsDiv').find('div').remove();
				for (let i = 0; i < response.abilitiesRequiringVerification.length; i++) {
					let ability = response.abilitiesRequiringVerification[i];
					
					let abilityDiv = $('<div></div>');
					let abilityName = $('<span></span>').html(ability.name);
					let abilityStatus = $('<span aria-hidden="true"></span>').addClass(ability.has ? "wdn-icon-ok green-icon" : "wdn-icon-cancel red-icon");

					abilityDiv.append(abilityStatus, abilityName);
					$('#certificationsDiv').append(abilityDiv);
				}
			},
			error: function(response) {
				alert("Unable to load abilities. Please refresh the page in a few minutes.");
			}
		});
	};

	let rolesMap = new Map();

	function loadRoles() {
		$.ajax({
			url: "/server/api/roles/getAll.php",
			type: "GET",
			dataType: "JSON",
			data: {
				roleId: true,
				name: true
			},
			cache: false,
			success: function(response) {
				for (let i = 0; i < response.length; i++) {
					let role = response[i];
					rolesMap.set(role.roleId, role.name);
				}
			}, 
			error: function(response) {
				alert("Unable to load roles. Please refresh the page in a few minutes.");
			}
		});
	}

	// Maps a siteId -> dates that site is open -> shifts for that date
	let shiftsMap = new Map();
	// Maps a siteId to the title of the site
	let sitesMap = new Map(); 

	function loadShifts() {
		$.ajax({
			url: "/server/profile/profile.php",
			type: "GET",
			dataType: "JSON",
			data: {
				action: 'getShifts'
			},
			cache: false,
			success: function(response) {
				for (let i = 0; i < response.shifts.length; i++) {
					let shift = response.shifts[i];

					// Create the shiftsMap
					if (!sitesMap.has(shift.siteId)) sitesMap.set(shift.siteId, shift.title);
					if (!shiftsMap.has(shift.siteId)) shiftsMap.set(shift.siteId, new Map());

					let datesMap = shiftsMap.get(shift.siteId);
					if (!datesMap.has(shift.dateString)) datesMap.set(shift.dateString, []);

					let shiftTimes = datesMap.get(shift.dateString);
					shiftTimes.push({
						'shiftId': shift.shiftId,
						'startTime': shift.startTimeString,
						'endTime': shift.endTimeString,
						'signedUp': shift.signedUp,
						'userShiftId': shift.userShiftId
					});

					// Append any shifts the person is already signed up for
					if (shift.signedUp) {
						appendSignedUpShift(shift.title, shift.dateString, shift.startTimeString, shift.endTimeString, shift.userShiftId, shift.siteId, shift.roleName);
					}
				}
			},
			error: function(response) {
				alert("Unable to load shifts. Please refresh the page in a few minutes.");
			}
		});
	}

	function appendSignedUpShift(siteTitle, dateString, startTimeString, endTimeString, userShiftId, siteId, roleName) {
		let shiftRow = $('<div></div>');
		let shiftInformation = $('<span></span>').html(`${siteTitle}: ${dateString} ${startTimeString} - ${endTimeString} (${roleName})`);
		let removeButton = $('<i></i>').addClass('fa fa-trash-o icon clickable').click(function() {
			$.ajax({
				url: "/server/profile/profile.php",
				type: "POST",
				dataType: "JSON",
				data: {
					action: 'removeShift',
					userShiftId: userShiftId
				},
				cache: false,
				success: function(response) {
					if (response.success) {
						shiftRow.remove();

						// Find the shift that just got removed and make it so we're not signed up for it anymore
						for (const shift of shiftsMap.get(siteId).get(dateString)) {
							if (shift.userShiftId === userShiftId) {
								shift.signedUp = false;
								shift.userShiftId = null;
								break;
							}
						}
					} else {
						alert(response.error);
					}
				},
				error: function(response) {
					alert('Unable to communicate with server. Try again in a few minutes.');
				}
			});
		});
		
		shiftRow.append(shiftInformation, removeButton);
		$('#shiftsSignedUpFor').append(shiftRow);
	}

	function initializeEventListeners() {
		$("#personalInformationEditButton").click(function(e) {
			$("#firstNameInput").val($("#firstNameText").html());
			$("#lastNameInput").val($("#lastNameText").html());
			$("#emailInput").val($("#emailText").html());
			$("#phoneNumberInput").val($("#phoneNumberText").html());
			
			$(".personal-info").find('input').show();		
			$(".personal-info").find('span').hide();

			$(this).hide();
			$("#personalInformationSaveButton").show();
			$("#personalInformationCancelButton").show();
		});

		$("#abilitiesEditButton").click(function(e) {
			$("#abilitiesSelect").find('.editView').show();		
			$("#abilitiesSelect").find('.preview').hide();
			$(this).hide();
			$("#abilitiesCancelButton").show()
		});

		$("#abilitiesCancelButton").click(function(e) {
			$("#abilitiesSelect").find('.editView').hide();		
			$("#abilitiesSelect").find('.preview').show();
			$(this).hide();
			$("#abilitiesEditButton").show()
		});

		$("#personalInformationCancelButton").click(function(e) {
			$(this).hide();
			$("#personalInformationSaveButton").hide();
			$("#personalInformationEditButton").show();

			$(".personal-info").find('span').show();
			$(".personal-info").find('input').hide();
		});

		$("#personalInformationSaveButton").click(function(e) {
			$(this).prop('disabled', true);
			$("#personalInformationCancelButton").prop('disabled', true);

			$.ajax({
				url: "/server/profile/profile.php",
				type: "POST",
				dataType: "JSON",
				data: {
					firstName: $("#firstNameInput").val(),
					lastName: $("#lastNameInput").val(),
					email: $("#emailInput").val(),
					phoneNumber: $("#phoneNumberInput").val(),
					action: "updatePersonalInformation"
				},
				cache: false,
				success: function(response) {
					if (response.success) {
						$("#firstNameText").html($("#firstNameInput").val());
						$("#lastNameText").html($("#lastNameInput").val());
						$("#emailText").html($("#emailInput").val());
						$("#phoneNumberText").html($("#phoneNumberInput").val());

						$(".personal-info").find('p').show();		
						$(".personal-info").find('input').hide();

						$("#personalInformationSaveButton").hide();
						$("#personalInformationCancelButton").hide();
						$("#personalInformationEditButton").show();
					} else {
						alert(response.error);
					}

					$("#personalInformationSaveButton").prop('disabled', false);
					$("#personalInformationCancelButton").prop('disabled', false);
				},
				error: function(response) {
					alert("Unable to communicate with the server. Please try again later.");
					$("#personalInformationSaveButton").prop('disabled', false);
					$("#personalInformationCancelButton").prop('disabled', false);
				}
			});
		});

		$("#addShiftButton").click(function(e) {
			let shiftRow = $('<div></div>').addClass("add-shift-div");
			let siteSelect = $('<select></select>').addClass("siteSelect");
			let dateSelect = $('<select></select>').addClass("dateSelect").attr('disabled', true);
			let timeSelect = $('<select></select>').addClass("timeSelect").attr('disabled', true);
			let roleSelect = $('<select></select>').addClass("roleSelect");
			
			siteSelect.append($('<option disabled selected value="" style="display:none"> -- Select a site -- </option>'));
			dateSelect.append($('<option disabled selected value="" style="display:none"> -- Select a date -- </option>'));
			timeSelect.append($('<option disabled selected value="" style="display:none"> -- Select a time -- </option>'));
			roleSelect.append($('<option disabled selected value="" style="display:none"> -- Select a role -- </option>'));

			for (const [siteId, title] of sitesMap) {
				siteSelect.append($('<option>', {
					value: siteId,
					text: title
				}));
			}

			siteSelect.change(function() {
				timeSelect.children('option').remove();
				timeSelect.append($('<option disabled selected value="" style="display:none"> -- Select a time -- </option>'));
				timeSelect.attr('disabled', true);			
				dateSelect.children('option').remove();
				dateSelect.append($('<option disabled selected value="" style="display:none"> -- Select a date -- </option>'));
				dateSelect.attr('disabled', false);
				
				let siteId = $(this).val();

				// populate dates select now based on which site was chosen
				for (const dateString of shiftsMap.get(siteId).keys()) {
					dateSelect.append($('<option>', {
						value: dateString,
						text: dateString
					}));
				}
			});

			dateSelect.change(function() {
				timeSelect.children('option').remove();
				timeSelect.append($('<option disabled selected value="" style="display:none"> -- Select a time -- </option>'));			
				timeSelect.attr('disabled', false);
				let siteId = siteSelect.val();
				let dateString = $(this).val();

				// populate shift times select now based on which date was chosen AND the user is not already signed up for it
				for (const shift of shiftsMap.get(siteId).get(dateString)) {
					timeSelect.append($('<option>', {
						value: shift.shiftId,
						text: `${shift.startTime} - ${shift.endTime}`,
						disabled: shift.signedUp
					}));
				}
			});

			for (const [roleId, name] of rolesMap) {
				roleSelect.append($('<option>', {
					value: roleId,
					text: name
				}));
			}

			let cancelButton = $('<button type="button"></button>').addClass("btn btn-seconday").html("Cancel").click(function(){
				$(this).parent().remove();
			});

			let signUpButton = $('<button type="button"></button>').addClass('btn btn-primary').html('Sign Up').click(function() {
				$(this).prop('disabled', true);
				cancelButton.prop('disabled', true);

				let siteId = siteSelect.val();
				let dateString = dateSelect.val();
				let shiftId = timeSelect.val();
				let roleId = roleSelect.val();

				$.ajax({
					url: "/server/profile/profile.php",
					type: "POST",
					dataType: "JSON",
					data: {
						shiftId: shiftId,
						roleId: roleId,
						action: "signUpForShift"
					},
					cache: false,
					success: function(response) {
						if (response.success) {
							shiftRow.remove();

							// Find the shift and append the p tags to show the user is signed up
							for (const shift of shiftsMap.get(siteId).get(dateString)) {
								if (shift.shiftId === shiftId) {
									shift.signedUp = true;
									shift.userShiftId = response.userShiftId;

									let title = sitesMap.get(siteId);
									let roleName = rolesMap.get(roleId);
									appendSignedUpShift(title, dateString, shift.startTime, shift.endTime, response.userShiftId, siteId, roleName);
									break;
								}
							}
						} else {
							alert(response.error);
						}

						signUpButton.prop('disabled', false);
						cancelButton.prop('disabled', false);
					},
					error: function(response) {
						alert("Unable to communicate with the server. Please try again later.");
						signUpButton.prop('disabled', false);
						cancelButton.prop('disabled', false);
					}
				});
			});
			

			shiftRow.append(siteSelect, dateSelect, timeSelect, roleSelect, signUpButton, cancelButton);
			$("#shifts").append(shiftRow);	
		});

		$('#abilitiesSelect').on('change', function(event){
			// abilities to be removed - all non-selected options with set ids
			let removeUserAbilityIds = $(this).children('.editView').children('input:not(:checked)[data-userAbilityId]').map(function(index, ele){
				return ele.dataset.userabilityid; // note this is case-sensitive and should be all lowercase
			}).get();

			// abilities to be added - all selected options w/o ids
			let addAbilityIds = $(this).children('.editView').children('input:checked:not([data-userAbilityId])').map(function(index, ele){
				return ele.value;
			}).get();

			$.ajax({
				dataType: 'JSON',
				method: 'POST',
				url: '/server/profile/profile.php',
				data: {
					action: 'updateAbilities',
					removeAbilityArray: removeUserAbilityIds,
					addAbilityArray: addAbilityIds
				},
				success: function(response){
					if (response.success) {
						loadAbilities();
					} else {
						alert(response.error);
					}
				}
			});
		});
	}
});
