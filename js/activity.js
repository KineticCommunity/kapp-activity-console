// !!!NEED TO INTEGRATE SUBMISSIONS!!!

// Extracts bridge parameter value from the form and splits it's value along the "::" so that the information can be extracted.
(function($){
    $(function() {
        var mergeData = [];
        // Configures API objects to be compatible with bridged resources.
        var apiConfigs = {
            "Submission": {
                "Mapping": "submissions",
                "Url": bundle.apiLocation()+"/kapps/activity/forms/sample-form/submissions?include=values",
                "columns": {
                    'Description': "City",
                    'Source': "Submission",
                    'Created At': "submittedAt",
                    'Instance Id': "User ID",
                    'Email': "submittedBy",
                    'Id': "id",
                    'Status': "coreState"
                }
            }
        };
        // Iterates through Api Configurations
        $.each(apiConfigs, function(index, config){
            $.ajax({
                type: "get",
                url: config.Url,
                dataType: "json",
                success: function(data, textStatus, jqXHR) {
                    $.each(data[config.Mapping], function(i, obj){
                        var submissionObject = {};
                            $.each(config.columns, function (key, value){
                                if(obj[value]){
                                    submissionObject[key] = obj[value]
                                }else if (obj.values[value]){
                                    submissionObject[key] = obj.values[value]
                                }else{
                                    submissionObject[key] = value
                                }
                            });
                        mergeData.push(submissionObject);
                    })
                },
                error: function(jqXHR) {
                }
            });
        });
        var bridges = bridgeAtrributes.slice(1,-1).split(", ");

        // Parses bridgeAtributes into an array, then iterates through that array and checks each bridge item against the first item in the parameter array.
        for (var i in bridges){
            var results = [];
            var bridgeinfo = bridges[i].split("::");
            var bridgeName = bridgeinfo[0];
            var parameter = bridgeinfo[1];
            var sortBy = bridgeinfo[2];

            // Preforms dynamic bridge call.
            K('bridgedResource['+bridgeName+']').load({
                values: {'key': parameter},
                success: function(response) {
                    results.push(bridgeName + 'response');
                    // Iterates over response data and pushes information to mergedata array
                    if (response != null){
                        $.each(response, function(j, thisResponse){
                            mergeData.push(thisResponse);
                        })
                    }

                    // Checks if every bridge in the bridges array has been called
                    if (results.length === bridges.length) {
                        // Sorts the mergeData array by prefered attribute
                        var orderedData = mergeData.sort(function(a, b) {
                            if (isNaN(parseFloat(a[sortBy])) && isNaN(parseFloat(b[sortBy]))){
                                return 0
                            }else if (isNaN(parseFloat(a[sortBy]))){
                                return -1
                            }else if (isNaN(parseFloat(b[sortBy]))){
                                return 1
                            }else{
                                return parseFloat(a[sortBy]) - parseFloat(b[sortBy]);
                            }
                        });

                        // aggregates the sources into a comprehensive list
                        var sourceList= [];
                        $.each(orderedData, function(index, activityItem){
                            if(sourceList.indexOf(activityItem.Source)<0){
                                sourceList.push(activityItem.Source);
                            }
                        });

                        // uses the sourceList to generate a series of checkboxes to refine search results
                        $.each(sourceList, function(index, value) {
                            console.log(sourceList);
                            var input = $('<label><input type="checkbox" value="' + value + '" checked="checked"/> ' + value + '</label>');
                            $("ul.sourcelist").append(input);
                        });

                        // appends the dataTable of activity console json
                        $('div.tableBody').append("<table id='activityTable'></table>");

                        // organizes information into dataTables
                        $('#activityTable').DataTable({
                            destroy:true,
                            "processing": true,
                            "data": orderedData,
                            "order": [[ 1, "asc" ]],
                            "createdRow": function(row, data, index) {
                                $(row).addClass(data.Source);
                            },
                            "columns": [
                                // { "visible": false, "data":"Instance Id", "title": "Instance Id" },
                                { "data": "Source", "title": "Source" },
                                // { "data": "Description", "title": "Description" },
                                { "data": "Created At", "title": "Creation Date" },
                                // { "data": "Status", "title": "Status" },
                                { "visible": false, "data": "Id", "title": "Id" }
                            ]
                        });

                        $('input[value]').click(function(){
                            var filteredSources = sourceList;
                            if (this.checked == false){
                                var index = filteredSources.indexOf(this.value);
                                filteredSources.splice(index, 1);
                            } else {
                                if (filteredSources.indexOf(this.value)<=0){
                                    filteredSources.push(this.value);
                                }
                            }
                            var pattern = ("\\b" + filteredSources.join('\\b|\\b') + '\\b');
                            $('#activityTable').DataTable().search( pattern, true, false ).draw();
                        })
                    }
                }
            })
        }
    })
})(jQuery);
