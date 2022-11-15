const AWS = require("aws-sdk");
const CustomAPIError = require("../errors/custom-error");

//initialize S3 instance

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION,
});
//upload file
exports.upload = async (file, key) => {
    //setting s3 parameters
    const parameters = {
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: file.data,
        ContentType: "image/png",
    };

    //uploading files to bucket
    await s3.upload(parameters).promise();
};
exports.getSignedURL = async(key) => {
    const url = await s3.getSignedUrlPromise('getObject',{
            Bucket : process.env.S3_BUCKET,
            Key : key,
            Expires : 60*5
        });
        if(!url) {
            throw new CustomAPIError("image not exist in bucket");
        }
        return url;
    };
