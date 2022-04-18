const { request, response } = require("express");
const Category = require("../../models/admin/cat.model");

exports.deleteCategory = (request, response) => {

    Category.deleteOne({ _id: request.body.id })
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
exports.getCategory = (request, response) => {
    Category.find().
    then(results => {
            return response.status(200).json(results);
        })
        .catch(err => {
            return response.status(500).json({ message: 'Sever Error' });
        });
}
exports.updateCategory = (request, response, next) => {

    Category.updateOne({
        _id: request.body.categoryid,
        $set: {
            catName: request.body.catName,
            catImage: "https://cakelicious-2.herokuapp.com/images" + request.file.filename
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
exports.addCategory = (request, response, next) => {
    console.log(request.body);
    console.log(request.file);
    Category.create({
            catName: request.body.catName,
            catImage: "https://cakelicious-2.herokuapp.com/images" + request.file.filename
        })
        .then(result => {
            return response.status(201).json(result);
        })
        .catch(err => {
            return response.status(403).json({ message: "Oops! Something went wrong.." });
        });
}