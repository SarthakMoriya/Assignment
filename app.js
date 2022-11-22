const express = require('express');
const axios = require('axios');
const e = require('express');
const app = express()
app.use(express.json())

app.get('/api/ping', (req, res) => {
    res.status(200).json({
        "success": true,

    })
})

app.get('/api/posts', async (req, res) => {
    try {
        let results
        let finalResult = [];
        let url = `https://api.hatchways.io/assessment/blog/posts?`
        const queryObj = { ...req.query };
        const excludeFields = ['limit', 'page', 'sort', 'fields','direction']
        excludeFields.forEach(el => delete queryObj[el])
        const tags = Object.values(queryObj).toLocaleString().split(',');
        console.log(tags.length, typeof (tags));

        for (let i = 0; i < tags.length; i++) {
            url = `https://api.hatchways.io/assessment/blog/posts?tag=${tags[i]}`

            const data = await axios.get(url)
            results = data.data.posts
            finalResult = finalResult.concat(results)
            console.log(tags);
               console.log(finalResult[0]);
        }

        let sortBy = req.query.sort
        let direction = req.query.direction
        console.log(sortBy,direction);
        finalResult = finalResult.sort(function (a,b) {
            console.log(a[sortBy],b[sortBy]);
            if(direction === 'asc')
            { 
               return a[sortBy] - b[sortBy]
                
            }
            else{
                    return b[sortBy] - a[sortBy]
            }
            
        })


        res.status(200).json({
            status: "Success",
            results: finalResult.length,
            data: finalResult
        })
    } catch (err) {
        res.status(400).json({
            status: "Error",
            message: err.message
        })
    }
})

app.listen(3000, () => {
    console.log(`server Running on port:3000`)
})