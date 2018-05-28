const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.generate_report = functions.https.onRequest((request, response) => {


    console.log(request.body);


    //--------- variable initialization start
    var adminNF; //from horse data
    var age; //get from horse data
    var athelete; //get from horse data
    var startDate = request.body.startDate;
    var endDate = request.body.endDate;

    // user will send it in format date/ month / year
    // we have to convert it to month/ date /year

    // console.log(startDate);
    // console.log(endDate);

    if (startDate == undefined || endDate == undefined) {
        return response.json({
            success: false,
            message: "Please provide the date"
        })
    }

    // now we have the date in format
    // date format month date year


    var date = startDate.split("/")[0];
    var month = startDate.split("/")[1];
    var year = startDate.split("/")[2];
    var sDate = month + "/" + date + "/" + year;

    date = endDate.split("/")[0];
    month = endDate.split("/")[1];
    year = endDate.split("/")[2];
    var eDate = month + "/" + date + "/" + year;


    startDate = new Date(startDate);
    endDate = new Date(endDate);

    sDate = new Date(sDate);
    eDate = new Date(eDate);


    if (request.body.comments) {
        var comments = request.body.comments
    } else {
        var comments = "----"
    }

    var competitions = []; //from horse data

    if (request.body.dam) {
        var dam = request.body.dam
    } else {
        var dam = "----"
    }

    var date; //from horse data
    var dateofBirth; //from horse data
    var feiid = request.body.feiid;

    if (request.body.horseCode) {
        var horseCode = request.body.horseCode
    } else {
        var horseCode = "----"
    }

    if (request.body.location) {
        var location = request.body.location
    } else {
        var location = "----"
    }

    var name; //from horse data

    var reportDateRange = request.body.startDate + "-" + request.body.endDate;

    if (request.body.secret) {
        var secret = parseInt(request.body.secret);
    } else {
        var secret = "----"
    }

    var sex; //from horse data

    if (request.body.sire) {
        var sire = request.body.sire
    } else {
        var sire = "----"
    }

    if (request.body.sireofDam) {
        var sireofDam = request.body.sireofDam
    } else {
        var sireofDam = "----"
    }

    if (request.body.trailStatus) {
        var trailStatus = request.body.trailStatus
    } else {
        var trailStatus = "----"
    }


    var url; //from horse data


    if (request.body.vetHistory) {
        var vetHistory = request.body.vetHistory
    } else {
        var vetHistory = "----"
    }


    if (request.body.videos) {
        var videos = request.body.videos
    } else {
        var videos = "----"
    }


    if (request.body.prices) {
        var prices = request.body.prices
    } else {
        var prices = "----"
    }

    //---------  variable initialization complete




    console.log(feiid);

    try {

        admin.database().ref('Horses').orderByChild('FEIID').equalTo(feiid).once('value', (snapshot) => {

            // horse data saved now we will do everything in memory to speed up things
            var data = snapshot.val();

            // assigning values to all the variables that needs to be assiged by using horse data

            console.log(data);

            if (data == null) {
                return response.json({
                    success: false,
                    message: "No horse found with this id"
                })
            }

            var horseData;

            for (let i in data) {
                horseData = data[i];
            }

            console.log(horseData);

            // horseData variables setup complete
            if (horseData['Date Of birth']) {

                console.log(horseData['Date Of birth']);
                date = horseData['Date Of birth'].split(" ")[0];
                //  age = horseData['Date Of birth'].split(" ")[1];
                //  if(age[2]){
                //   age = age[1]+age[2] +' - '+ date; 
                // }else{
                //   age = age[1]+' - '+ date;
                // }

                age = horseData['Date Of birth'];


                dateofBirth = horseData['Date Of birth'];
            } else {
                age = "----";
                date = "----";
                dateofBirth = "----"
            }

            if (horseData['Admin NF']) {
                console.log(horseData['Admin NF'])
                adminNF = horseData['Admin NF'];
            } else {
                adminNF = "----"
            }




            if (horseData.Competitions) {

                console.log(horseData.Competitions);
                // here we will competitions in to array

                var data = horseData.Competitions;

                competitions = Object.keys(data).map(key => {
                    return data[key];
                })


                athelete = competitions[0].Athlete;
            } else {
                competitions = "----";
                athelete = '----';
            }


            if (horseData.Name) {
                name = horseData.Name;

            } else {
                name = "----";

            }

            if (horseData.Sex) {
                sex = horseData.Sex;

            } else {
                sex = "----";

            }

            if (horseData.URL) {
                url = horseData.URL;

            } else {
                url = "----";

            }

            // horseData variables setup complete

            // now we have to use competitions to find competitions and performances
            // first from competition get all those obejcts that are within the date range

            var competitionsInRange = [];

            competitions.forEach(function(element) {
                // converting date into month date year format
                var str = element.StartDate;

                // console.log(str); 

                var date = str.split("/")[0];
                var month = str.split("/")[1];
                var year = str.split("/")[2];

                var date = month + "/" + date + "/" + year;

                // console.log(date); 


                var currentDate = new Date(date);
                if (currentDate > sDate && currentDate < eDate) {
                    competitionsInRange.push(element);
                }
            })


            var performance = [];

            if (competitionsInRange.length <= 3) {
                return response.json({
                    success: false,
                    error: "Not enough data in this date range to compute the report"
                })
            }

            // we will have to parse it so that we could arr

            var arr2 = []

            competitionsInRange.forEach(function(obj) {
                if (obj.ObstHeight) {


                    var ObstHeight = obj.ObstHeight.split("-")[0];
                    // console.log(ObstHeight);
                    var temp = {

                        "Athlete": obj.Athlete,
                        // "Athlete_url" : obj.Athlete_url,
                        "ObstHeight": ObstHeight,
                        "Score": obj.Score,
                        "Show": obj.Show,
                        "Pos":obj.Pos,
                        "Event":obj.Event,
                        "StartDate": obj.StartDate

                    }

                    arr2.push(temp);


                }


            })

            competitionsInRange = arr2;


            competitionsInRange.sort(function(x, y) {
                return y.ObstHeight - x.ObstHeight;
            });

            var highest = competitionsInRange[0];
            var secondhighest = competitionsInRange[1];
            var thirdhighest = competitionsInRange[2];


            // console.log(highest);
            var i = 1;

            while (highest.ObstHeight === secondhighest.ObstHeight) {
                secondhighest = competitionsInRange[i];
                i++;
            }

            while (secondhighest.ObstHeight === thirdhighest.ObstHeight || highest.ObstHeight === thirdhighest.ObstHeight) {
                thirdhighest = competitionsInRange[i];
                i++;
                if (i == competitionsInRange.length) {
                    return response.json({
                        success: false,
                        error: "Not enough data in this date range to compute the report"
                    });
                    break;
                }
            }

            // console.log(secondhighest);
            // console.log(thirdhighest);


            var highestArr = [];
            var secondhighestArr = [];
            var thirdhighestArr = [];

            var highestArr = competitionsInRange.filter(function(obj) {
                return obj.ObstHeight == highest.ObstHeight;
            });

            var secondhighestArr = competitionsInRange.filter(function(obj) {
                return obj.ObstHeight == secondhighest.ObstHeight;
            });


            var thirdhighestArr = competitionsInRange.filter(function(obj) {
                return obj.ObstHeight == thirdhighest.ObstHeight;
            });


            // console.log(highestArr);
            // console.log(secondhighestArr);
            // console.log(thirdhighestArr);



            var index2 = computeFaults(highestArr);

            var index1 = computeFaults(secondhighestArr);

            var index0 = computeFaults(thirdhighestArr);

            // console.log(index2);
            // console.log(index1);
            // console.log(index0);

            performance.push(null);
            performance.push(index0);
            performance.push(index1);
            performance.push(index2);


            var reportObject = {
                'AdminNF': adminNF,
                'Age': age,
                'Athlete': athelete,
                'Comments': comments,
                'Competitions': competitionsInRange,
                'Dam': dam,
                'Date': date,
                'DateOfBirth': dateofBirth,
                'FEIID': feiid,
                'HorseCode': horseCode,
                'Location': location,
                'Name': name,
                'Performance': performance,
                'ReportDateRange': reportDateRange,
                'SECRET': secret,
                'Sex': sex,
                'Sire': sire,
                'SireofDam': sireofDam,
                'TrailStatus': trailStatus,
                'URL': url,
                'VetHistory': vetHistory,
                'Videos': videos,
                'prices': prices
            }




            // response.json(reportObject);

            //  console.log(feiid);


            admin.database().ref(`reports/${feiid}`).update(reportObject, function(error) {
                if (error) {
                    response.json({
                        success: false,
                        error: error
                    });
                } else {
                    response.json({
                        success: true,
                        data: "data saved successfully"
                    });
                }
            });

        })


    } catch (err) {
        response.json({
            success: false,
            error: err
        });
    }


});



function computeFaults(arr) {
    var zeroto3 = 0;
    var eightto11 = 0;
    var fourto7 = 0;
    var twelveup = 0;
    var el = 0;
    var ret = 0;
    var wd = 0;
    var other = 0;
    // placings
    var oneTo5 = 0;
    var sixTo10 = 0;
    var elevenTo15 = 0;

    var pos = {};

    arr.forEach(function(element) {

        var score = element.Score;
        if (element.Pos) {
            var position = element.Pos;

            if (position >= 0 && position <= 5) {
                oneTo5++;
            } else if (position >= 6 && position <= 10) {
                sixTo10++;
            } else {
                elevenTo15++;
            }


            pos = {
                '1to5': oneTo5 + "",
                '6to10': sixTo10 + "",
                '11to15': elevenTo15 + ""
            }

        } else {

            pos = {
                '1to5': "0",
                '6to10': "0",
                '11to15': "0"
            }

        }

        score = score.split('/')[0];

        console.log(score);

        // the error is here score is split and we are performing a check which causes errors

        if (score >= 0 && score <= 3) {
            zeroto3++;
        } else if (score >= 4 && score <= 7) {
            fourto7++;
        } else if (score >= 8 && score <= 11) {
            eightto11++;
        } else if (score >= 12) {
            twelveup++;
        } else if (score.toUpperCase() == 'R1 EL') {
            el++;
        } else if (score.toUpperCase() == 'R1 RET') {
            ret++;
        } else if (score.toUpperCase() == 'R1 WD') {
            wd++;
        } else {
            other++;
        }


    })


    var faults = {
        '0to3': zeroto3 + "",
        '4to7': fourto7 + "",
        '8to11': eightto11 + "",
        '12up': twelveup + "",
        'el': el + "",
        'ret': ret + "",
        'wd': wd + "",
        'other': other + ""
    }
    var total = zeroto3 + fourto7 + eightto11 + twelveup + el + ret + wd + other + "";
    var obj = {
        'class': arr[0].ObstHeight,
        'faults': faults,
        'placing': pos,
        'total': total
    }

    return obj;


}