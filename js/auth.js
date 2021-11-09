$(function () {
    
    $('[data-toggle="tooltip"]').tooltip()
    
    // Unhide Helper Text
    $('#show_debug_btn').click(function () {

        var isHidden = document.getElementsByClassName('d-none');
        console.log(isHidden)
        if (isHidden.length > 0) {
            $('#step1output').removeClass("d-none");
            $('#step3output').removeClass("d-none");
            $('#step4outputa').removeClass("d-none");
            $('#step4outputb').removeClass("d-none");
        } else {
            $('#step1output').addClass("d-none");
            $('#step3output').addClass("d-none");
            $('#step4outputa').addClass("d-none");
            $('#step4outputb').addClass("d-none");
        };
        
    });
    
    // Get device_code and verification_with_code_uri link
    $('#auth_gen_btn').click(function () {
        var data = {}
        var api_url =  $('#service_url_input').val() + "/api/auth_uri"

        console.log(api_url)

        var settings = {
            "url": api_url,
            "method": "GET",
            "timeout": 0,
            "headers": {
              // "Content-Type": "application/x-www-form-urlencoded"
              "Content-Type": "application/json"
            },
            "data": JSON.stringify(data)
          };
          $.ajax(settings).done(function (response) {
            // console.log(response);
            $('#auth_uri_out').val(response.verification_with_code_uri)
            $('#device_code_out').val(response.device_code)
            // Enable the navigation button
            $('#auth_nav_btn').removeAttr('disabled')
          });
    });

    // Navigate to Authentication URI Link
    $('#auth_nav_btn').click(function () {
        var URL = $('#auth_uri_out').val()
        window.open(URL, '_blank');
    });
    

    // Use device_code and to get auth token
    $('#token_gen_btn').click(function () {
        var data = {}
        data["device_code"] = $('#device_code_out').val()
        var api_url = $('#service_url_input').val() + '/api/access_token'

        // console.log(data)
        // var body = JSON.stringify(data)

        var settings = {
            "url": api_url,
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/json"
            },
            "data": JSON.stringify({
              "device_code": data["device_code"]
            }),
          };


          $.ajax(settings).done(function (response) {
            // console.log(response);
            $('#token_out').val(response.access_token)
          });
    });


    // List Projects
    $('#list_proj_btn').click(function () {
      var data = {}
      data["access_token"] = $('#token_out').val()
      var api_url = $('#service_url_input').val() + '/api/list_projects'

      var settings = {
          "url": api_url,
          "method": "GET",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          "data": JSON.stringify({
            "access_token": data["access_token"]
          })
        };

        $.ajax(settings).done(function (response) {

          var proj_data = JSON.parse(response.output);
          for(var key in proj_data){
            var item_id = proj_data[key]['Id']
            var item_name = proj_data[key]['Name']
            var authLink = '<input id="auth_check_'.concat(item_id,'" name="auth_check" value="',item_id ,'" type="checkbox">');
            proj_data[key]['Auth'] = authLink;
          }

          $(function () {
            // Unhide the table
            $('#proj_table').removeClass("d-none");
            // Fill the table with project results
                      $('#proj_table').bootstrapTable({
                          data: proj_data,
                          formatLoadingMessage: function() {
                              return '';
                          }

                      });
            $("#proj_table").bootstrapTable("hideLoading");
            });

        });
    });



    // $('#list_proj_btn').click(function () {

    //     $.support.cors = true

    //     var bear_token = "Bearer ".concat($('#token_out').val())
    //     // console.log(bear_token)
    //     // var body = JSON.stringify(data)
        
    //     $.ajax({
    //         type: "POST",
    //         url: "php/get_projects.php",
    //         data: {token: bear_token},
    //         dataType: 'JSON', 
    //         success: function(response){
    //             // console.log(response.output);
    //             // console.log(JSON.parse(response.output)['Response']['Items']);

    //             $('#proj_out').val(response.output);

    //             var proj_data = JSON.parse(response.output)['Response']['Items'];

    //             for(var key in proj_data){
    //                 var item_id = proj_data[key]['Id']
    //                 var authLink = '<input id="auth_check_'.concat(item_id,'" name="auth_check" value="',item_id ,'" type="checkbox">');
    //                 proj_data[key]['Auth'] = authLink;

    //             }

    //             console.log(proj_data)

    //             $(function () {
		// 			// Unhide the table
		// 			$('#proj_table').removeClass("d-none");
		// 			// Fill the table with project results
    //                 $('#proj_table').bootstrapTable({
    //                     data: proj_data,
    //                     formatLoadingMessage: function() {
    //                         return '';
    //                     }

    //                 });
		// 			$("#proj_table").bootstrapTable("hideLoading");
    //             });
    //         }
    //     }); 
    // });
    
    // List Select Projects to Auth
    $('#auth_proj_btn').click(function () {
        var data = {};

        data["client_id"] = $('#client_id_input').val();
        
        var ids_arr = [];
        var ids_scope_arr = [];
        
        // For each checked project, add its ID to the scope list
        $("input:checkbox[name=auth_check]:checked").each(function(){
            ids_arr.push($(this).val());
            ids_scope_arr.push("read project ".concat($(this).val()));
        });
        
        // Also add `browse global`
        ids_scope_arr.push("browse global")
        
        var proj_ids_csv = ids_arr.toString();
        var proj_ids_scope_csv = ids_scope_arr.toString();
        
        console.log(proj_ids_csv);
        console.log(proj_ids_scope_csv);
        
        $('#proj_ids_out').val(proj_ids_csv);
        
        var settings = {
            "url": "https://api.basespace.illumina.com/v1pre3/oauthv2/deviceauthorization",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": {
              "client_id": data["client_id"],
              "response_type": "device_code",
              "scope": proj_ids_scope_csv
            }
          };
          $.ajax(settings).done(function (response) {
            // console.log(response);
            $('#auth_uri_proj_out').val(response.verification_with_code_uri)
            // Enable the navigation button
            $('#auth_nav_proj_btn').removeAttr('disabled')
          });
    });
    
    // Navigate to Project-Level Authentication URI Link
    $('#auth_nav_proj_btn').click(function () {
        var URL = $('#auth_uri_proj_out').val()
        window.open(URL, '_blank');
    });
});