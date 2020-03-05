const express = require("express");
const router = express.Router();
const moment = require("moment");
const Entry = require("../models/entry");
const Stock = require("../models/stock");
const User = require("../models/user");
const Product = require("../models/product");

const mongoose = require("mongoose");
const formatResponse = require("../utils/formatResponse");

router.get(("/"),(req, res, next) => {
    Entry.find().exec().then(result => {
        res.status(200).json(formatResponse(true,"entries retrieved successfully",{entries:result}));
    }).catch(error => {
        res.status(500).json(formatResponse(false,`error occured while retrieving entries: ${error}`))
    });
});

router.post(("/"),async (req, res, next) => {
    let product = [];
    let user = [];
    let stock = [];
    let remaining = 0;
    let taken = undefined;
    let consumed = undefined;
    let returned = undefined;

    await Product.findById(req.body.product_id).exec().then(result => {
        product = result;
    }).catch(error => {
        console.log(error)
    });

    await User.findById(req.body.user_id).exec().then(result => {
        user = result;
    }).catch(error => {
        console.log(error)
    });

    await Stock.find({product_id:req.body.product_id,user_id:req.body.user_id  }).exec().then(result => {
        stock = result[0];
    }).catch(error => {
        console.log(error)
    });
    if(req.body.entry_type === "taken"){
        remaining = Number(stock.bag_value) + Number(req.body.entry_value);
        taken = Number(req.body.entry_value)
    }else if(req.body.entry_type === "consumed"){
        remaining = Number(stock.bag_value) - Number(req.body.entry_value);
        consumed = Number(req.body.entry_value)
    }else if(req.body.entry_type === "returned"){
        remaining = Number(stock.bag_value) - Number(req.body.entry_value);
        returned = Number(req.body.entry_value)
    }else{
        remaining = Number(stock.bag_value)
    }
await Stock.findOne({product_id:req.body.product_id,user_id:req.body.user_id  }).exec().then(result => {
    stock = result;
    result.bag_value = remaining;
    result.save()
}).catch(error => {
    console.log(error)
});

    const entry = new Entry({
        _id:new mongoose.Types.ObjectId(),
        user_id:req.body.user_id,
        product_id:req.body.product_id,
        product_name:product.name,
        user_name:user.name,
        entry_type:req.body.entry_type,
        entry_value:req.body.entry_value,
        taken:taken || 0,
        consumed:consumed || 0,
        returned:returned || 0,
        remaining:Number(remaining),
        created_at: moment().format("DD-MM-YYYY hh:mm A")
    })
    entry.save().then((result) => {
        res.status(201).json(formatResponse(true,"entry created successfully",{createdEntry:entry}));
    }).catch(error => {
        res.status(500).json(formatResponse(false,`error while creating entry: ${error}`));        
    });
});

router.delete(("/:entryId"),(req, res, next) => {
    const id = req.params.entryId;
    Entry.findByIdAndRemove(id).exec().then(response => {
        res.status(200).json({
            message:"entry deleted successsfully",
            id: response.id
        });
    }).catch(error => {
        res.status(500).json(formatResponse(false,`error while deleting entry: ${error}`));
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