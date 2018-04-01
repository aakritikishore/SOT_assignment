//Script for search employee data
$(document).on("click", ".search", function() {  
    var search_msgs = ["Accepting search...", "Searching data...", "Getting Result...","About to finish search...", "Rendering data..."];
    var filter = $('#filter').val();
    var value  = $('#value').val();
    $('#displayResources').empty();
    var displayResources = $('#displayResources');
    //url to search data without filter
    var url = 'http://52.87.171.80/sample_crud_rest/api/v1/employee'; 
    //url when search is done with filter
    if(filter !== '0' && value !== ''){
        var url = 'http://52.87.171.80/sample_crud_rest/api/v1/employee?fields=emp_id,emp_username,emp_first_name,emp_last_name,emp_gender,emp_phone,emp_email,emp_address,emp_designation,emp_department&filter='+filter+'='+value;
    }
    var data="";
    var fetch_res= fetch_call(url,'GET',data,'application/x-www-form-urlencoded; charset=UTF-8');
    fetch_res.then(
        actions(search_msgs)
    )
    .then(function(data) {
        var output = get_employee_table(data);
        displayResources.html(output);
        $("table").addClass("table table-hover");
    });
});

//Api call to get data in edit form usi api call to get data of employee id to be edited
$(document).on("click", "#edit", function() { 
    var emp_id	= $(this).attr('row_id');
    var url = 'http://52.87.171.80/sample_crud_rest/api/v1/employee/'+emp_id; 
    var data = "";
    var fetch_res = fetch_call(url,'GET',data,'application/x-www-form-urlencoded; charset=UTF-8');
    fetch_res.then(function(data) {
       get_data_in_edit_form(data);
    });
});

//Script to delete employee data
$(document).on("click", "#delete", function() { 
    var emp_id	= $(this).attr('row_id');
    var url= 'http://52.87.171.80/sample_crud_rest/api/v1/employee/'+emp_id;
    var fetch_res = fetch_call(url,'DELETE',data,'application/json');
    var data = "";
    fetch_res.then(function (data) {
        $('#display_resources').show();
        $('#'+emp_id).hide();
        console.log('Employee record removed successfully', data);
        $('#msg_log').show();
        $('.panel-heading').html("Deleted Employee Data");
        $("#msg_log").addClass("panel-primary");
        $('html, body').animate({
            scrollTop: $("body").offset().top
        }, 100); 
        $("#msg_log").delay(5000).fadeOut("slow");
    });
});


//function performed after submitting add/edit employee form
function addEmployee(){
    $( "#myform" ).validate({
        rules: {
            username: {
                required: true
            },
            fname: {
                required: true
            },
            lname: {
                required: true
            },
            gender: {
                required: true
            },
            email: {
                required: true
            },
            phone: {
                required: true,
                minlength: 10,
                maxlength: 10
            },
            designation: {
                required: true
            },
            department: {
                required: true
            }
        }
    });
    var data = {
        emp_username: $('#username').val(),
        emp_first_name :$('#fname').val(),
        emp_last_name : $('#lname').val(),
        emp_gender :$("input[name='gender']:checked"). val(),
        emp_email: $('#email').val(),
        emp_phone : $('#phone').val(),
        emp_address : $('#address').val(),
        emp_designation : $('#designation').val(),
        emp_department : $('#department').val()
    };
    
    //edit operation
    if($('#emp_id').val() !== '' && $('#action').val() === 'edit_flag'){
        var emp_id = $('#emp_id').val();
        var url = 'http://52.87.171.80/sample_crud_rest/api/v1/employee/'+emp_id;
        var fetch_res = fetch_call(url,'PUT',data,'application/json');
        fetch_res.then($('#myModal').modal('hide'))
        .then(function (data) {
            console.log('Employee record edited successfully', data);
            refresh_edited_row(emp_id,data);
            $('#msg_log').show();
            $('.panel-heading').html("Updated Employee Data");
            $("#msg_log").addClass("panel-primary");
            $('html, body').animate({
                scrollTop: $("body").offset().top
            }, 100); 
            $("#msg_log").delay(5000).fadeOut("slow");
        });
    }
    else {
        //add operation
        var url = 'http://52.87.171.80/sample_crud_rest/api/v1/employee';
        var fetch_res = fetch_call(url,'POST',data,'application/json');
        fetch_res.then(function (data) {
            console.log('Employee record added successfully', data);
            var department = get_department(data.data.emp_department);
            $('#myModal').modal('hide');
            var i = 0;
            $('#employee tr:last').after("<tr id="+ data.data.emp_id +" ><td class='hidden-xs hidden-sm'>" + i +"</td><td class='visible-xs'>"+ data.data.emp_first_name +" "+data.data.emp_last_name+" ("+data.data.emp_gender +")<br/><span class='glyphicon glyphicon-envelope'></span>"+data.data.emp_email+"<br/><span class='glyphicon glyphicon-phone'></span>"+data.data.emp_phone+"</td><td class='hidden-xs hidden-sm'>" + data.data.emp_first_name + "</td><td class='hidden-xs hidden-sm'>" + data.data.emp_last_name + "</td><td class='visible-sm hidden-xs'>"+data.data.emp_first_name+" "+data.data.emp_last_name+"<br/>("+ data.data.emp_gender +")</td><td class='hidden-xs hidden-sm'>" + data.data.emp_gender + "</td><td class='hidden-xs hidden-sm'>" + data.data.emp_email + "</td><td class='hidden-xs hidden-sm'>" + data.data.emp_phone + "</td><td class='visible-sm'>"+data.data.emp_email+"<br/>"+ data.data.emp_phone +"</td><td class='visible-xs'>"+ data.data.emp_designation +"<br/>"+ department +"</td><td class='hidden-xs'>" + data.data.emp_address + "</td><td class='visible-sm'>"+data.data.emp_designation+"<br/>"+ department +"</td><td class='hidden-xs hidden-sm'>" + data.data.emp_designation + "</td><td class='hidden-xs hidden-sm'>" + department + "</td><td><button type='button' class='btn btn-info' id='edit' i="+i+" row_id="+ data.emp_id +" data-toggle='modal' data-target='#myModal'><span class='glyphicon glyphicon-pencil'></span></button><button type='button' class='btn btn-danger' id='delete' row_id="+ data.data.emp_id +"><span class='glyphicon glyphicon-remove'></span></button></td></tr>");
            $('#msg_log').show();
            $('.panel-heading').html("Added Employee Data");
            $("#msg_log").addClass("panel-primary");
            $('html, body').animate({
                scrollTop: $("body").offset().top
            }, 100); 
            $("#msg_log").delay(5000).fadeOut("slow");
        });
    }
    return false;
}

//Api call
function fetch_call(url,method_name,data,content_data){
    if(data !== ""){
        var call = fetch(url,{
            method: method_name,
            body: JSON.stringify(data), 
            headers: {
              "Content-type": content_data
            }
        });
    }else{
        var call =  fetch(url,{
            method: method_name,
            headers: {
              "Content-type": content_data
            }
        });
    }
    return call.then(status)
        .then(json)
        .catch(function (error) {
            console.log('Request failed', error);
            $('#msg_log').show();
            $('.panel-heading').html(error);
            $("#msg_log").addClass("panel-danger");
            $('html, body').animate({
                scrollTop: $("body").offset().top
            }, 100); 
            $("#msg_log").delay(5000).fadeOut("slow");
            $('#loading_percent').hide();
            $('#loading_text').hide();
            $('#image').hide();
			$('#search_button').prop('disabled', false);
        });
}

function status(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(new Error(response.statusText))
    }
}

function json(response) {
    return response.json();
}

//Function to display msg while searching data
function displayMessage(msgs){
    var random1 = generate_random(20,1);
    var random2 = generate_random(50,random1);
    var random3 = generate_random(30,random2);
    var random4 = generate_random(40,random3);
    var random5 = generate_random(50,random4);
    var $percent_count = $('#percent_count');  
    var value = 0;
    var interval = generate_random(400,100);
    setInterval(function () {
        if(value < 100){
            value++;
            if(value <= random1 ){
                $('#loading_text').text(msgs[0]);
            }
            if(value === random2){
                $('#loading_text').text(msgs[1]);
                interval = generate_random(2000,100);
            }
            else if(value === random3 ){
                $('#loading_text').text(msgs[2]);
                interval = generate_random(500,100);
            }
            else if(value === random4 ){
                $('#loading_text').text(msgs[3]);
                interval = generate_random(2000,1000);
            }
            else if (value === random5 ){
                $('#loading_text').text(msgs[4]);
                interval = generate_random(3000,200);
            }
            $percent_count.html(value);
        } else {
            $('#loading_text').hide();
            $('#image').fadeOut(2000);
            $('#loading_percent').fadeOut(2000,function() {
                $('#displayResources').delay(10000).show();
            });
            $('#search_button').prop('disabled', false);
        }
    }, interval); 
}

//To generate random number
function generate_random(ceil,flr){
   var random_number=Math.floor((Math.random() * ceil) + flr);
   return random_number;
}

//Actions to be performed after search
function actions(msgs){
    $('#display_resources').hide();
    $('#empty_search').hide();
    $('#search_button').prop('disabled', true);
    $('#loader_image').show();
    $('#loading_percent').show();
    $('#loading_text').show();
    displayMessage(msgs);
}

//Refresh row after edit
function refresh_edited_row(emp_id,data){
    var department = get_department(data.data.department);
    $("#"+ emp_id).find("td").eq(1).html(data.data.emp_first_name+" "+data.data.emp_last_name+" ("+data.data.emp_gender +")<br/><span class='glyphicon glyphicon-envelope'></span>"+data.data.emp_email+"<br/><span class='glyphicon glyphicon-phone'></span>"+data.data.emp_phone);
    $("#"+ emp_id).find("td").eq(2).html(data.data.emp_first_name);
    $("#"+ emp_id).find("td").eq(3).html(data.data.emp_last_name);
    $("#"+ emp_id).find("td").eq(4).html(data.data.emp_first_name+" "+data.data.emp_last_name+"<br/>("+ data.data.emp_gender);
    $("#"+ emp_id).find("td").eq(5).html(data.data.emp_gender);
    $("#"+ emp_id).find("td").eq(6).html(data.data.emp_email);
    $("#"+ emp_id).find("td").eq(7).html(data.data.emp_phone);
    $("#"+ emp_id).find("td").eq(8).html(data.data.emp_email+"<br/>"+ data.data.emp_phone);
    $("#"+ emp_id).find("td").eq(9).html(data.data.emp_designation +"<br/>"+ department);
    $("#"+ emp_id).find("td").eq(10).html(data.data.emp_address);
    $("#"+ emp_id).find("td").eq(11).html(data.data.emp_designation+"<br/>"+ department);
    $("#"+ emp_id).find("td").eq(12).html(data.data.emp_designation);
    $("#"+ emp_id).find("td").eq(13).html(department);
}

//To get department name after fetching data
function get_department(department_name){
    if(department_name === 'SD'){
        var department = 'Software Development';
    }else if(department_name === 'BD'){
        var department = 'Bussiness Development';
    }else{
        var department = 'Human Resource';
    }
    return department;
}

function get_employee_table(data){
      var output = $('#displayResources').html();
        output +="<table id='employee'><thead><tr><th class='hidden-xs hidden-sm th-srno'>Sr no.</th><th class='visible-xs'>Employee</th><th class='hidden-xs hidden-sm th-fname'>First Name</th><th class='hidden-xs hidden-sm th-lname'>Last Name</th><th class='visible-sm hidden-xs th-name'> Name</th><th class='hidden-xs hidden-sm th-gender'>Gender</th><th class='hidden-xs hidden-sm th-email'>Email</th><th class='hidden-xs hidden-sm th-phone'>Phone</th><th class='visible-sm th-contact'>Contact</th><th class='hidden-xs th-address'>Address</th><th class='visible-sm th-dept'>Department</th><th class='visible-xs'>Designation</th><th class='hidden-xs hidden-sm th-designation'>Designation</th><th class='hidden-xs hidden-sm th-department'>Department</th><th class='th-action'>Action</th></thead><tbody>";
        for (var i in data.data) {
            var department = get_department(data.data[i].emp_department);
            var index = parseInt(i)+1;
            output += "<tr id="+ data.data[i].emp_id +"><td class='hidden-xs hidden-sm'>"+ index  +"</td><td class='visible-xs'>"+data.data[i].emp_first_name+" "+data.data[i].emp_last_name+" ("+data.data[i].emp_gender +")<br/><span class='glyphicon glyphicon-envelope'></span> "+data.data[i].emp_email+"<br/><span class='glyphicon glyphicon-phone'></span> "+data.data[i].emp_phone+"</td><td class='hidden-xs hidden-sm'>" + data.data[i].emp_first_name + "</td><td class='hidden-xs hidden-sm'>" + data.data[i].emp_last_name + "</td><td class='visible-sm hidden-xs'>"+data.data[i].emp_first_name+" "+data.data[i].emp_last_name+"<br/>("+ data.data[i].emp_gender +")</td><td class='hidden-xs hidden-sm'>" + data.data[i].emp_gender + "</td><td class='hidden-xs hidden-sm row_email'>" + data.data[i].emp_email + "</td><td class='hidden-xs hidden-sm'>" + data.data[i].emp_phone + "</td><td class='visible-sm'><span class='glyphicon glyphicon-envelope'></span> "+data.data[i].emp_email+"<br/><span class='glyphicon glyphicon-phone'></span> "+ data.data[i].emp_phone +"</td><td class='visible-xs'>"+ data.data[i].emp_designation +"<br/>"+ department +"</td><td class='hidden-xs'>" + data.data[i].emp_address + "</td><td class='visible-sm'>"+data.data[i].emp_designation+"<br/><i>"+ department +"</i></td><td class='hidden-xs hidden-sm'>" + data.data[i].emp_designation + "</td><td class='hidden-xs hidden-sm'>" + department + "</td>";
            output += "<td>";
            output += "<button type='button' class='btn btn-info' id='edit' row_id="+ data.data[i].emp_id +" data-toggle='modal' data-target='#myModal'><span class='glyphicon glyphicon-pencil'></span></button>";
            output += " <button type='button' class='btn btn-danger' id='delete' row_id="+ data.data[i].emp_id +"><span class='glyphicon glyphicon-remove'></span></button>";
            output += "</td>";
            output += "</tr>";
        }    
        output += "</tbody></table>";
        return output;
}

function get_data_in_edit_form(data){
    $('#username').val(data.data['0']['emp_username']);
    $('#fname').val(data.data['0']['emp_first_name']);
    $('#lname').val(data.data['0']['emp_last_name']);
    $("input[name='gender'][value='"+data.data['0']['emp_gender']+"']").prop("checked",true);
    $('#email').val(data.data['0']['emp_email']);
    $('#address').html(data.data['0']['emp_address']);
    $('#phone').val(data.data['0']['emp_phone']);
    $('#designation').val(data.data['0']['emp_designation']);
    $('#department').val(data.data['0']['emp_department']);
    $('#emp_id').val(data.data['0']['emp_id']);
    $('#action').val('edit_flag');
}