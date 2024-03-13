const express = require('express'); //--1
const app = express();

const connectDB = require('./config/database.js') //--2
connectDB();

const dotenv = require('dotenv'); //--3
dotenv.config();

// For body-parser
const bodyParser = require('body-parser'); //--4
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const data = require('./data/User.json') //--5

// Middleware pulls the data  static   
//  bulid in middleware are also available for 
// error handing => it as coded in post router down below


 app.use(express.urlencoded({extended:true})); 
 app.use(express.json());

 const cors = require("cors"); //--6
 app.use(cors());


// ----------CRUD Operations Contact Routes Starts Here!!!!

// @path/contact
// adding new contact
// @method post
// access public
const Contact = require('./models/contactModels'); //--7

// app.route("/contact").post((req,res)=>{

//     let newContact = new Contact(req.body);
//     newContact.save((err,contact)=>{
//         if(err){
//             res.send(err);
//         }
//         res.json(contact);
//     });
// });

app.route("/contact").post((req, res) => {
    let newContact = new Contact(req.body);
    newContact.save()
        .then(contact => {
            res.json(contact);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});


//@path /contact
//@desc getting all contacts created
//@method get
//@access public


// app.route("/contact").get((req, res) => {
// 	Contact.find({}, (err, contact) => {
// 		if (err) {
// 			res.send(err);
// 		}
// 		res.json(contact);
// 	});
// });

app.route("/contact").get(async (req, res) => {
	try {
		const contacts = await Contact.find({});
		res.json(contacts);
	} catch (err) {
		res.status(500).send(err);
	}
});

//@path /contact/:contactID
//@desc getting contact by ID
//@method get
//@access public
app.route("/contact/:contactID").get((req, res) => {
	Contact.findById(req.params.contactID, (err, contact) => {
		if (err) {
			res.send(err);
		}
		res.json(contact);
	});
});

//@path /contact/:contactID
//@desc updating contact by ID
//@method put
//@access public
app.route("/contact/:contactID").put((req, res) => {
	Contact.findOneAndUpdate(
		{ _id: req.params.contactID },
		req.body,
		{ new: true, useFindAndModify: false },
		(err, contact) => {
			if (err) {
				res.send(err);
			}
			res.json(contact);
		}
	);
});

//@path /contact/:contactID
//@desc deleting contact by ID
//@method delete
//@access public
app.route("/contact/:contactID").delete((req, res) => {
	Contact.deleteOne({ _id: req.params.contactID }, (err, message) => {
		if (err) {
			res.send(err);
		}
		res.json({ message: "contact successfully deleted" });
	});
});
// ----------CURD Operations Contact Routes ENDS Here!!!!



// 4 Methods get, post,put, Delete// GET => Gets the data from the Server// POST => Sends the data from the Server// PUT => Upadate the data from the Server// DELETE => Delete the data from the Server

app.get('/user/:id/', (req,res, next) => {
    // res.send(` get request is sending on port ${PORT}`);
    console.log(req.params.id);  // String
    let user = Number(req.params.id);  //number / integer
    console.log(user);
    console.log(data[user]);
    res.send(data[user]);
    next();
},
(res,req)=>{
    console.log("The Second function");
}

);

app.route('/post')
    .get( (req,res) => {
        // throw new Error();
    // res.end() // this will end the call
    // res.redirect("https://www.linkedin.com/")
    // res.send(` POST request is sending on port ${PORT}`);
    console.log(`Request from: ${req.originalUrl}`);
    console.log(`Request type: ${req.method}`);
        res.json(data);

})
    .post((req, res) => {
        console.log(req.body);
        res.send(req.body);
})

    .put( (req,res) => {
    res.send(` PUT request is sending on port ${PORT}`)
})

    .delete( (req,res) => {
    res.send(` DELETE request is sending on port ${PORT}`)
});

// Error Handlings
// app.use((err, req, res, next)=>{
//     console.error(err.stack);
//     res.status(500).send (`Red Alert ${err.stack}`)
// })


// const favicon = require("serve-favicon"); //--8
// const path = require("path");
// app.use(favicon(path.join(__dirname, 'MERN/public', "favicon.ico")));


const PORT = process.env.PORT || 5000
app.listen(
    PORT, 
    console.log(`server running in ${process.env.NODE_ENV} mode on  port ${PORT}`));

// const http = require('http');
// const url = require('url');
// const querystring = require('querystring');
// const fs = require('fs');
// const Contact = require('./models/contactModels');
// const data = require('./data/User.json');

// const server = http.createServer((req, res) => {
//     const parsedUrl = url.parse(req.url);
//     const path = parsedUrl.pathname;
//     const query = querystring.parse(parsedUrl.query);

//     if (req.method === 'GET' && path === '/user') {
//         const userId = parseInt(query.id);
//         if (!isNaN(userId) && userId >= 0 && userId < data.length) {
//             res.writeHead(200, {'Content-Type': 'application/json'});
//             res.end(JSON.stringify(data[userId]));
//         } else {
//             res.writeHead(404, {'Content-Type': 'text/plain'});
//             res.end('User not found');
//         }
//     } else if (req.method === 'POST' && path === '/post') {
//         let body = '';
//         req.on('data', chunk => {
//             body += chunk.toString();
//         });
//         req.on('end', () => {
//             const postData = JSON.parse(body);
//             res.writeHead(200, {'Content-Type': 'application/json'});
//             res.end(JSON.stringify(postData));
//         });
//     } else if (req.method === 'GET' && path === '/post') {
//         res.writeHead(200, {'Content-Type': 'application/json'});
//         res.end(JSON.stringify(data));
//     } else if (req.method === 'POST' && path === '/contact') {
//         let body = '';
//         req.on('data', chunk => {
//             body += chunk.toString();
//         });
//         req.on('end', () => {
//             const contactData = JSON.parse(body);
//             const newContact = new Contact(contactData);
//             newContact.save((err, contact) => {
//                 if (err) {
//                     res.writeHead(500, {'Content-Type': 'application/json'});
//                     res.end(JSON.stringify({error: err.message}));
//                 } else {
//                     res.writeHead(201, {'Content-Type': 'application/json'});
//                     res.end(JSON.stringify(contact));
//                 }
//             });
//         });
//     } else if (req.method === 'GET' && path === '/contact') {
//         Contact.find({}, (err, contacts) => {
//             if (err) {
//                 res.writeHead(500, {'Content-Type': 'application/json'});
//                 res.end(JSON.stringify({error: err.message}));
//             } else {
//                 res.writeHead(200, {'Content-Type': 'application/json'});
//                 res.end(JSON.stringify(contacts));
//             }
//         });
//     } else if (req.method === 'GET' && path.startsWith('/contact/')) {
//         const contactId = path.substring('/contact/'.length);
//         Contact.findById(contactId, (err, contact) => {
//             if (err) {
//                 res.writeHead(500, {'Content-Type': 'application/json'});
//                 res.end(JSON.stringify({error: err.message}));
//             } else if (!contact) {
//                 res.writeHead(404, {'Content-Type': 'text/plain'});
//                 res.end('Contact not found');
//             } else {
//                 res.writeHead(200, {'Content-Type': 'application/json'});
//                 res.end(JSON.stringify(contact));
//             }
//         });
//     } else if (req.method === 'PUT' && path.startsWith('/contact/')) {
//         const contactId = path.substring('/contact/'.length);
//         let body = '';
//         req.on('data', chunk => {
//             body += chunk.toString();
//         });
//         req.on('end', () => {
//             const updateData = JSON.parse(body);
//             Contact.findOneAndUpdate(
//                 {_id: contactId},
//                 updateData,
//                 {new: true, useFindAndModify: false},
//                 (err, contact) => {
//                     if (err) {
//                         res.writeHead(500, {'Content-Type': 'application/json'});
//                         res.end(JSON.stringify({error: err.message}));
//                     } else if (!contact) {
//                         res.writeHead(404, {'Content-Type': 'text/plain'});
//                         res.end('Contact not found');
//                     } else {
//                         res.writeHead(200, {'Content-Type': 'application/json'});
//                         res.end(JSON.stringify(contact));
//                     }
//                 }
//             );
//         });
//     } else if (req.method === 'DELETE' && path.startsWith('/contact/')) {
//         const contactId = path.substring('/contact/'.length);
//         Contact.deleteOne({_id: contactId}, (err, result) => {
//             if (err) {
//                 res.writeHead(500, {'Content-Type': 'application/json'});
//                 res.end(JSON.stringify({error: err.message}));
//             } else if (result.deletedCount === 0) {
//                 res.writeHead(404, {'Content-Type': 'text/plain'});
//                 res.end('Contact not found');
//             } else {
//                 res.writeHead(200, {'Content-Type': 'application/json'});
//                 res.end(JSON.stringify({message: 'Contact successfully deleted'}));
//             }
//         });
//     } else {
//         res.writeHead(404, {'Content-Type': 'text/plain'});
//         res.end('Not Found');
//     }
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//     console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
// });
