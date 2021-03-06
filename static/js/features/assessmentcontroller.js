/**
 * This script is the event handler for assessments.html
 * Author: Lemuel Jay V. Vallinas
 * Contributors: Dexter Esin
 * **/


function validateAssessmentForm() {
    var assessmentName = $('input[name=recgradassessmentname]').val();
    var assessmentType = $('#recgradassessmenttype').val();
    var assessmentTotal = $('input[name=recgradtotal]').val();
    if(assessmentName.trim(" ") == '' || assessmentType == null || assessmentTotal.trim(" ") == '') {
        $('.recgradbar-error').removeClass('hidden');
        return false;
    } else {
        $('.recgradbar-error').addClass('hidden');
        $('.recgradbar-error-redundant').addClass('hidden');
        return true;
    }
}

function createAssessment() {
    /* Load spinner. */
    $('#assessmentspinnerspinner').removeClass('hidden');

    /* Get data. */
    var csrfmiddlewaretoken = $('input[name=csrfmiddlewaretoken]').val();
    var assessmentName = $('input[name=recgradassessmentname]').val().toUpperCase();
    var assessmentType = $('#recgradassessmenttype').val();
    var assessmentTypeName = $('#recgradassessmenttype option[value=' + assessmentType + ']').text();
    var assessmentTotal = $('input[name=recgradtotal]').val();
    var gradingPeriod = $('#gradingnumber').text();
    var subject_id = $('#recgradbar div:nth-child(1) span:nth-child(1)').text();
    /* Send data. */
    $.ajax({
        type: 'POST',
        url: '/create_assessment/',
        data: {'csrfmiddlewaretoken': csrfmiddlewaretoken, 'assessmentName': assessmentName, 'assessmentType': assessmentType, 'assessmentTotal': assessmentTotal, 'gradingPeriod': gradingPeriod,
        'subject_id': subject_id},
        success: function(data) {
            /* Check for uniqueness. */
            if(data['error']) {{
                /* If there is redundancy. */
                $('.recgradbar-error').addClass('hidden');
                $('.recgradbar-error-redundant').removeClass('hidden');
            }} else {
                /* No redundancy, go for gold. */
                $('.recgradbar-error').addClass('hidden');
                $('.recgradbar-error-redundant').addClass('hidden');
                $("<tr id='trassessment" + data['assessment_id'] + "'>" +
                "<td>" +
                "<i onclick='' class='fa fa-apple fa-2x'></i>" +
                "</td>" +
                "<td>" + assessmentName + "</td>" +
                "<td>" + assessmentTotal + "</td>" +
                "<td>" + assessmentTypeName + "</td>" +
                "<td>" + gradingPeriod + " Grading" + "</td>" +
                "<td>" + data['timezone'] + "</td>" +
                "<td>" +
                "<i class='fa fa-save fa-2x hidden savebutton' onclick=''></i>" +
                "<i class='fa fa-edit fa-2x editbutton' onclick=''></i>" +
                "<i class='fa fa-remove fa-2x removebutton' onclick=''></i>" +
                "</td>" +
                "</tr>").appendTo('#tableassessmentsview table tbody').hide().fadeIn();
                /* Clear Form */
                $('input[name=recgradassessmentname]').val('');
                $('#recgradassessmenttype').val(0);
                $('input[name=recgradtotal]').val('');
                alertify.success(assessmentName + ' successfully updated!');
                }
            $('#assessmentspinnerspinner').addClass('hidden');
        }
    });
}

function deleteAssessment(assessment_id) {
    var csrfmiddlewaretoken = $('input[name=csrfmiddlewaretoken]').val();
    var assessment_name = $('#tdassessmenttextname' + assessment_id).text();
    alertify.confirm('THINK AGAIN!', 'You cannot undo these once deleted.', function() {
        $.ajax({
        type: 'POST',
        url: '/remove_assessment/',
        data: {'csrfmiddlewaretoken': csrfmiddlewaretoken, 'assessment_id': assessment_id},
        success: function() {
            $('#assessmentspinnerspinner').removeClass('hidden');
            $('#trassessment' + assessment_id).fadeOut('fast', function() {
                $('#trassessment' + assessment_id).remove();
                $('#assessmentspinnerspinner').addClass('hidden');
                console.log($('#tdassessmenttextname' + assessment_id).text());
                alertify.error(assessment_name + ' successfully removed!');
            });
        }
    });
    }, function() {

    });
}

function editAssessment(assessment_id) {
    /* Buttons */
    $('.savebutton').addClass('hidden');
    $('.editbutton').removeClass('hidden');
    $('#assessmenteditbutton' + assessment_id).addClass('hidden');
    $('#assessmentsavebutton' + assessment_id).removeClass('hidden');
    /* Inputs and T.D's and set values. */
    $('.tdassessmenttext').removeClass('hidden');
    $('#tdassessmenttextname' + assessment_id).addClass('hidden');
    $('#tdassessmenttexttotal' + assessment_id).addClass('hidden');
    $('#tdassessmenttexttype' + assessment_id).addClass('hidden');
    $('.assessmentinput').addClass('hidden');
    $('#tdassessmentinputname' + assessment_id).val($('#tdassessmenttextname' + assessment_id).text()).removeClass('hidden');
    $('#tdassessmentinputtotal' + assessment_id).val($('#tdassessmenttexttotal' + assessment_id).text()).removeClass('hidden');
    var type = $('#tdassessmenttexttype' + assessment_id).text();
    var value = 0;
    switch(type) {
        case "Written Works":
            value = 1;
            break;
        case "Performance Tasks":
            value = 2;
            break;
        case "Quarterly Exams":
            value = 3;
            break;
    }
    $('#tdassessmentinputselect' + assessment_id).val(value).removeClass('hidden');

}

function saveAssessment(assessment_id) {
    /* Validate */
    var validated = false;
    var assessment_name = $('#tdassessmentinputname' + assessment_id).val();
    var total = $('#tdassessmentinputtotal' + assessment_id).val();
    var assessment_type = $('#tdassessmentinputselect' + assessment_id).val();
    if(assessment_name.trim(" ") == '' || total.trim(" ") == '' || total == 0 || assessment_type == null) {
        validated = false;
    } else {
        validated = true;
    }
    /* Save when validated. */
    if(validated) {
        var csrfmiddlewaretoken = $('input[name=csrfmiddlewaretoken]').val();
        $.ajax({
            type: 'POST',
            url: '/save_assessment/',
            data: {'csrfmiddlewaretoken': csrfmiddlewaretoken, 'assessment_id': assessment_id, 'assessment_name': assessment_name,'total': total, 'assessment_type': assessment_type},
            success: function(data) {
                /* Check for  redundancy*/
                if(data['error']) {
                    $('.recgradbar-error').addClass('hidden');
                    $('.recgradbar-error-redundant').removeClass('hidden');
                } else {
                    /* Set input. */
                    $('#tdassessmenttextname' + assessment_id).text(assessment_name);
                    $('#tdassessmenttexttotal' + assessment_id).text(total);
                    switch(assessment_type) {
                        case '1':
                            $('#tdassessmenttexttype' + assessment_id).text("Written Works");
                            break;
                        case '2':
                            $('#tdassessmenttexttype' + assessment_id).text("Performance Tasks");
                            break;
                        case '3':
                            $('#tdassessmenttexttype' + assessment_id).text("Quarterly Exams");
                            break;
                    }
                    /* Toggle views */
                    $('.assessmentinput').addClass('hidden');
                    $('.tdassessmenttext').removeClass('hidden');
                    $('#assessmenteditbutton' + assessment_id).removeClass('hidden');
                    $('#assessmentsavebutton' + assessment_id).addClass('hidden');
                    /* Hide errors. */
                    $('.recgradbar-error').addClass('hidden');
                    $('.recgradbar-error-redundant').addClass('hidden');
                    alertify.success(assessment_name + ' successfully updated!');
                }
            }
        });
    } else {
        /* Show invalid form error. */
        $('.recgradbar-error').removeClass('hidden');
        $('.recgradbar-error-redundant').addClass('hidden');
    }
}

function goToAssessment() {

}

function goToStudentGrades() {

}

function goToViewStudents() {

}

$(document).ready(function() {
    $('input[value="Create Assessment"]').click(function() {
        $('.recgradbar-error').addClass('hidden');
        $('.recgradbar-error-redundant').addClass('hidden');
       /* Validate */
       if(validateAssessmentForm()) {
            /* Send Form */
           createAssessment();

       } else {

       }
    });
});