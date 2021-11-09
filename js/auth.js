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
        // var data = {}
        // data["device_code"] = $('#device_code_out').val()
        var api_url = $('#service_url_input').val() + '/api/access_token?device_code=' + $('#device_code_out').val()

        // console.log(data)
        // var body = JSON.stringify(data)

        var settings = {
            "url": api_url,
            "method": "GET",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/json"
            },
            // "data": {
            //   "device_code": data["device_code"]
            // },
          };


          $.ajax(settings).done(function (response) {
            // console.log(response);
            $('#token_out').val(response.access_token)
          });
    });


    // List Projects
    $('#list_proj_btn').click(function () {
      // var data = {}
      // data["access_token"] = $('#token_out').val()
      var api_url = $('#service_url_input').val() + '/api/list_projects?access_token=' + $('#token_out').val()
      console.log(api_url)
      var settings = {
          "url": api_url,
          "method": "GET",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json"
          },
          dataType: "json"
          // "data": JSON.stringify({
          //   "access_token": data["access_token"]
          // })
        };

        $.ajax(settings).done(function (response) {
          console.log(response)
          var proj_data = response
          
          // var proj_data = response.output
          
          for(var proj in proj_data){
            console.log(proj)
            var item_id = proj_data[proj]['Id']
            var item_name = proj_data[proj]['Name']
            console.log(item_name)
            var authLink = '<input id="auth_check_'.concat(item_id,'" name="auth_check" value="',item_id ,'" type="checkbox">');
            proj_data[proj]['Auth'] = authLink;
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


    // Get device_code and verification_with_code_uri link
    $('#auth_proj_btn').click(function () {
      // var data = {}
      var ids_arr = [];
      
      // For each checked project, add its ID to the scope list
      $("input:checkbox[name=auth_check]:checked").each(function(){
          ids_arr.push($(this).val());
      });
      
      var proj_ids_csv = ids_arr.toString();
      
      console.log(proj_ids_csv);
      
      $('#proj_ids_out').val(proj_ids_csv);

      var api_url =  $('#service_url_input').val() + "/api/project_auth?project_ids=" + proj_ids_csv

      console.log(api_url)

      var settings = {
          "url": api_url,
          "method": "GET",
          "timeout": 0,
          "headers": {
            // "Content-Type": "application/x-www-form-urlencoded"
            "Content-Type": "application/json"
          },
          // "data": JSON.stringify(data)
        };
        $.ajax(settings).done(function (response) {
          // console.log(response);
          $('#auth_uri_proj_out').val(response.verification_with_code_uri)
          $('#device_proj_code_out').val(response.device_code)
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

    // Use device_code and to get auth token (project-level)
    $('#proj_token_gen_btn').click(function () {
      // var data = {}
      // data["device_code"] = $('#device_proj_code_out').val()
      var api_url = $('#service_url_input').val() + '/api/access_token?device_code=' + $('#device_proj_code_out').val()

      // console.log(data)
      // var body = JSON.stringify(data)

      var settings = {
          "url": api_url,
          "method": "GET",
          "timeout": 0,
          "headers": {
            "Content-Type": "application/json"
          },
          // "data": {
          //   "device_code": data["device_code"]
          // },
        };


        $.ajax(settings).done(function (response) {
          // console.log(response);
          $('#proj_token_out').val(response.access_token)
        });
  });