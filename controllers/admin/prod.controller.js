const path = require("path");
const Product = require("../../models/admin/prod.model");

exports.addProduct = (request, response, next) => {
    console.log(request.body);
    console.log(request.file);
    Product.create({
            category: request.body.category,
            prodName: request.body.prodName,
            prodImage: "https://localhost:3000/images/" + request.file.filename,
            prodPrice: request.body.prodPrice,
            prodDescription: request.body.prodDescription
        })
        .then(result => {
            return response.status(201).json(result);
        })
        .catch(err => {
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
exports.updateProduct = (request, response, next) => {

    Product.updateOne({
        _id: request.body.productid,
        $set: {
            prodName: request.body.prodName,
            prodPrice: request.body.prodPrice,
            prodDescription: request.body.prodDescription,
            prodImage: "https://localhost:3000/images/" + request.file.filename
        }
    }).then(result => {
        if (result.modifiedCount)
            return response.status(204).json({ message: 'success' });
        else
            return response.status(404).json({ message: 'record not found' })
    }).catch(err => {
        return response.status(500).json({ message: 'Something went wrong..' });
    });
}