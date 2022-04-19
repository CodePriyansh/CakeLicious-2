const path = require("path");
const Product = require("../../models/admin/prod.model");
const {Storage} = require("@google-cloud/storage");
const request = require('request')
const Gstorage = new Storage({
    keyFilename : "storeimges-firebase-adminsdk-9t7gc-1e1f2e9b45.json"
})
let bucketName = "gs://storeimges.appspot.com"

const uploadFile = async (filename) => {
    // Uploads a local file to the bucket
    await Gstorage.bucket(bucketName).upload(filename, {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: true,
      // By setting the option `destination`, you can change the name of the
      // object you are uploading to a bucket.
      metadata: {
        metadata: {
          firebaseStorageDownloadTokens: "hello"
        }
      },
    });
    console.log(`${filename} uploaded to ${bucketName}.`);
  }
exports.addProduct = (request, response, next) => {
    console.log(request.body);
    console.log(request.file);
    Product.create({
            category: request.body.category,
            prodName: request.body.prodName,
            prodImage:  "https://firebasestorage.googleapis.com/v0/b/storeimges.appspot.com/o/"+ request.file.filename+"?alt=media&token=hello",
            prodPrice: request.body.prodPrice,
            prodDescription: request.body.prodDescription,
            flavour:request.body.flavour
        })
        .then(result => {
            return response.status(201).json(result);
        })
        .catch(err => {
            console.log(err);
            return response.status(403).json({ message: "Oops! Something went wrong.." });
        });
}
exports.getProduct = (request, response) => {
    Product.find().
    then(results => {
            return response.status(200).json(results);
        })
        .catch(err => {
            return response.status(500).json({ message: 'Sever Error' });
        });
}
exports.deleteProduct = (request, response) => {

    Product.deleteOne({ _id: request.body.id })
        .then(result => {
            console.log(result)
            if (result.deletedCount)
                return response.status(202).json({ message: 'success' });
            else
                return response.status(204).json({ message: 'not deleted' });
        })
        .catch(err => {
            console.log(err)
            return response.status(500).json({ message: 'Something went wrong' });
        });
}

exports.updateProduct = (req, response, next) => {
    let newImage;
         if(req.file){
            
              newImage = "https://firebasestorage.googleapis.com/v0/b/storeimges.appspot.com/o/"+req.file.filename+"?alt=media&token=hello";
   uploadFile(path.join("public/images/") + req.file.filename) 
         
     request({
         url: req.body.oldImage,
         qs:{
         key:"MIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQDJStx61fe3YVc/\nj+3mM1RZYc9BIlh7yPJpoGN+FYy7p5SK6hqRQLuSIWxM5bF7LmfiKXsbePyVxTnt\nOSMQ38nY0ioLg5T03Q78ecE4LDmFP7Yj6o8KLWkuSSvJBz22v7ByjIaO2EjCKpqP\nlHFkDfEiFi2DmRBpbC5wThZC+KO6L8P5hliccJ7c7YV9seY1GCaDES8s86ZDYeeU\neamgs+ilMERALxcg0Bw3iL3H4OXvc6LBZFsAf4gGOK8iLEiANtCGfS0M5iDxBDnV\n7FvutEHqjzeDj61qUBCPNBLQ5ZOrz+5x9NIWC43XcnOVQargbAqvFGowL/GjyAYn\nVLsEG61FAgMBAAECgf9kDhIJ/NFlFb2ImsJl6p3C0Bt1BN12qivU1SSfR5bssB/l\n7PfHu6WAvZxXnNTbpfV9NaE7xqfGyoJAqGYFvTdXzx+XGZCxJjCMzvh8M39j/IdM\n0wrGxEvD9hsNkcvbSu0qAy/fUSLZYNPzCpZSZZu2lc+J2kuOG3f52ta182Fu6e1o\nMff1PA2MAR3DK3ljfl2ilI8kPG/GOxgoNGc/XPo01xo/UdBN9RxWUsC5zMUdoqtr\npgYXV9G7IiQ0j3RqiYcxbhmncDJ0gUyNxzdKMgSSQpxK6NoInzx/AcCxIWELwuYj\nYSlaAnNgcuJfjh6SOmJaZ3wxVjZDQi8a0loVg2ECgYEA6/H7mPK6Tml+pUVwWaNc\n2T5ZqrYvVFejWgSFdl8kk5flyFD9iJoyPmx1jTu0mXdxUfnpZrh6HSMk0maae6w7\nebsRpGLrFZZSSLi524B0pVF1s4nb0GHTq2kczHgzIoSojabpJgKJ1zFu1/Mnr4RR\nnQsW6Mp7lc2NqVCKLImdY+UCgYEA2mba969Wu4PqRcgGuznH3du1niu8nlkMxh4w\nbrMxVOlyGS43+OajEQEF7pAXLvbxJOkKZ/rV0VbZxu11UCT477roLXYZhUguqhR9\n52XgcE4aqJWTYm2hkq3mfcYSXK4qAO6yjO5yhRXe3uIY/Z7Mj614DAP8+Y/f8Ho8\n0A0fTeECgYBjM/wII85Hl72C+b4yQiiQwtFqoG0n9i0ddRc0XO6BC/W2Eq921vZX\nHr0SI89cU0cXI4+J+/iD9bnOqQs9An6DQS86wch77BcuslSawNjKhYSKd2UvqWIZ\nCPnt0oAVfFduL4aJz7lq/ELRk0/VUToLYJVCTZhGtQVh8hYWgcnmLQKBgFQg/MYe\nP5254duBgr5KMqhOgvZryJuCl/4VEPkDg8Q+rJnwiNUTGstpBnzv+k44B4n9Tung\n4M5j0z3iqKb3pwDJkbg5XvlNZdRUUm95eewo2fIItB5dNrkGzduzGc2jtUBoslTB\nYVHMq+5VT+Uab5gE7VJLkv4bIttCavyFoYJhAoGBALkEhOeHf7UBQ3BUBxU692H5\nPDMN7/EqKlNq/I9uLJsRqDLTI0QxH0XVVowNeXI3JPszx0Q31yh3VAp8FQr8U+TS\n/kmX0ferlKdvhyyQDiRKFBWp1djqUi5RpzI3HgjNU8yTrIZnvEIQqrsI9xKWlkhO\n9bq/BhFoQbqpbSMHlJHK"},
         method: 'DELETE'
     })
 }else{
     newImage = "https://firebasestorage.googleapis.com/v0/b/storeimges.appspot.com/o/"+req.body.oldImage+"?alt=media&token=hello";
 }


    Product.updateOne({
        _id: req.body.productid},{
        $set: {
            prodName: req.body.prodName,
            prodPrice: req.body.prodPrice,
            prodDescription: req.body.prodDescription,
            prodImage:  newImage
        }
    }).then(result => {
        if (result.modifiedCount)
            return response.status(200).json({ message: 'success' });
        else
            return response.status(404).json({ message: 'record not found' })
    }).catch(err => {
        console.log(err)
        return response.status(500).json({ message: 'Something went wrong..' });
    });
}

exports.getProductByCategory = (req,res)=>{
    Product.find({category:req.body.id}).then(result=>{
        res.status(200).json(result)
    }).catch(err=>{
        res.status(500).json(err)
    })

}