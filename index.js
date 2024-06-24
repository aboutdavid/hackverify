require("dotenv").config();
const Airtable = require('airtable')
var base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN }).base(process.env.AIRTABLE_BASE);
const express = require('express')
const app = express()

app.get('/check/id/:id', (req, res) => {
    const { id } = req.params
    const { apiKey } = req.query

    if (!process.env.API_KEYS.split(",").includes(apiKey)) return res.json({ verified: false, error: "Not authed. 401" }).status(401)
    base(process.env.AIRTABLE_TABLE).select({
        view: "API View"
    }).all(async function (err, r) {
        if (err) return console.error(err)
        var acceptableResponses = ["Eligible L1", "Eligible L2"]
        const record = r.find(rec => rec.get("Hack Club Slack ID") == id && acceptableResponses.includes(rec.get("Verification Status")))
        return res.json({
            verified: Boolean(record)
        })
    })
})


app.listen(process.env.PORT || 3000, () => {
    console.log(`Verification API listening.`)
})
