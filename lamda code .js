const AWS = require('aws-sdk');
const str = require('querystring')

const Client = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
const s3 = new AWS.S3();
var filecontent = "[";
var finalstr = "";
const bucketName = "whizlabs-dynamodb-s3-json";
const filePath = "myfile.json";
exports.handler = (event, context, callback) => {
    var parameter = {
        TableName: 'mydynamoDB',
        Limit: 10
    };
    
    Client.scan(parameter, function(err,data) {
        if(err)
        callback(err, null);
        else
        {
            
            var count = Object.keys(data.Items);
            for (var i = (count.length-1); i >= 0; i--) 
            {
                console.info("\nStudent ID: "+data.Items[i]['Sid']+"\n");
                console.info("\nStudent Name: "+data.Items[i]['Name']+"\n");
                console.info("\nCourse: "+data.Items[i]['Course']+"\n");
                
                
                filecontent += '{\"Sid\":\"'+data.Items[i]['Sid']+'\",\"Name:\"'+data.Items[i]['Name']+'\",\"Course:\"'+data.Items[i]['Course']+'\"}';
                if ( i != 0 )
                {
                    filecontent= filecontent+",";
                    
                }
                
                console.info("200 : success");
            }
            filecontent= filecontent+"]";
            putObjectToS3(bucketName,filePath,filecontent);
            
            callback(null,"200 : success");
        }
    });
};
function putObjectToS3(bucket, key, data){
    var s3 = new AWS.S3();
        var params = {
            Bucket : bucket,
            Key : key,
            Body : data
        };
        s3.putObject(params, function(err, data) {
          if (err) 
          console.log(err, err.stack); // an error occurred
          else     
          console.info("File"+key+"Created\n"+data);           // successful response
        });
}
