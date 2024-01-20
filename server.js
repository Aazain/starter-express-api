/********************************************************************************* 
 * BTI425 – Assignment 1*
 * 
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:
 * 
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 * 
 * Name: Aazain Rafiq   Student ID: 146710223 Date: 2024-01-19
 * 
 * Published URL: ___________________________________________________________
 * 
 *********************************************************************************/

const express = require("express");
const dotenv = require('dotenv').config();
var cors = require('cors')
const app = express();
const mongoose = require('mongoose');
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json())
const ListingsDB = require("./modules/listingsDB.js");
const db = new ListingsDB();

const MONGODB_CONN_STRING = "mongodb+srv://dbUser:GDJ3NMe9YioR7f0l@cluster0.2k7c3kd.mongodb.net/sample_airbnb";

mongoose.connect(MONGODB_CONN_STRING)

const HTTP_PORT = process.env.PORT || 8080;

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{console.log(err);})
    
app.get("/", async (req, res) => {
    res.json({message: "API Listening"});
})

app.post("/api/listings", async (req, res) => {
    try {
        const createListing = await db.addNewListing(req.body);
        res.status(201).json(createListing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create a new listing" });
    }
});

app.get("/api/listings", async (req, res) => {
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);
    const nameFilter = req.query.name;

    try {
        const getListings = await db.getAllListings(page, perPage, nameFilter);
        res.status(200).json(getListings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get listings" });
    }
});

app.get("/api/listings/:id", async (req, res) => {
    try {
        const getListingsById = await db.getListingById(req.params.id);
        if(getListingsById){
            res.status(200).json(getListingsById);
        }
        else{
            res.status(404).json({ message: "Listing does not exist" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get listings" });
    }
});

app.put("/api/listings/:id", async (req, res) => {
    try {
        const updateListing = await db.updateListingById(req.body, req.params.id);
        if(updateListing){
            res.status(200).json({ message: "Updated listing" });
        }
        else{
            res.status(404).json({ message: "Listing does not exist" });
        }    
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update listing" });
    }
});


app.delete("/api/listings/:id", async (req, res) => {
    try {
        const deleteListing = await db.deleteListingById(req.params.id);
        if(deleteListing){
            res.status(200).json({ message: "Deleted listing" });
        }
        else{
            res.status(404).json({ message: "Listing does not exist" });
        }    
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update listing" });
    }
});


