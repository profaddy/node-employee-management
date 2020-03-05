const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const mongoose = require("mongoose");
const formatResponse = require("../utils/formatResponse");

router.get(("/"),(req, res, next) => {
    Product.find().exec().then(result => {
        res.status(200).json(formatResponse(true,"product retrieved successfully",{products:result}));
    }).catch(error => {
        res.status(500).json(formatResponse(false,`error occured while retrieving product: ${error}`))
    });
});

router.post(("/"),(req, res, next) => {
    const product = new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name
    })
    product.save().then((result) => {
        res.status(201).json(formatResponse(true,"product created successfully",{createdProduct:product}));
    }).catch(error => {
        res.status(500).json(formatResponse(false,`error while creating product: ${error}`));        
    });
});

router.delete(("/:productId"),(req, res, next) => {
    const id = req.params.productId;
    Product.findByIdAndRemove(id).exec().then(response => {
        res.status(200).json({
            message:"product deleted successsfully",
            id: response.id
        });
    }).catch(error => {
        res.status(500).json(formatResponse(false,`error while deleting product: ${error}`));
    })
});

// router.get(("/:productId"),(req, res, next) => {
//     const id = req.params.productId;
//     Product.findById(id).exec().then(product => {
//         console.log(product)
//         res.status(200).json({product:product});
//     }).catch(error => {console.log(error)})
// });

// router.patch(("/:productId"),(req, res, next) => {
//     let message = "product edited"
//     if(req.params.productId === "specific"){
//         message = "specific product edited"
//     }
//     res.status(200).json({
//         messaage:message
//     });
// });

module.exports = router;
