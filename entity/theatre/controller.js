'use strict';

const mysqlService = require('../../service/mysql');
const queries = require('./queries');

/**
 * Update the info of the logged theatre.
 * 
 * @name update
 * @function
 * @param {Object} req - The request object of Express.
 * @param {Object} req.session - User session data.
 * @param {Integer} req.session.id - User ID.
 * @param {Object} req.body - Body of the request.
 * @param {String} req.body.name - New theatre name.
 * @param {String} req.body.address - New theatre address.
 * @param {String} req.body.site_url - New theatre site url.
 * @param {String} req.body.phone - New theatre phone.
 * @param {String} req.body.history - New theatre history.
 * @param {Object} res - The response object of Express.
 * @param {Function} next - Express callback argument.
 */
exports.update = (req, res, next) => {
    let userId = req.session.id;
    let body = req.body; // Esto se va a validar en el validador

    let params = [
        body,
        userId
    ];

    mysqlService.executeQuery(queries.updateTheatre, params, (err, results) => {
        if (err) {
            return res.status(500).send('Internal Server Error.');
        }

        if (!results.affectedRows) {
            return res.status(400).send('Can\'t find the theatre.');
        }

        mysqlService.executeQuery(queries.getTheatreAfterUpdate, [userId], (err, results) => {
            if (err || !results.length) {
                return res.status(500).send('Internal Server Error.');
            }

            let parsedResults = {
                id: results[0].id,
                name: results[0].name,
                address: results[0].address,
                phone: results[0].phone,
                email: results[0].email,
                site_url: results[0].site_url,
                history: results[0].history,
                country: results[0].country,
                province: results[0].province,
                profile_image: results[0].profile_image,
                cover_image: results[0].cover_image,
                city: results[0].city,
                circuit_type: results[0].circuit_type,
                gallery: []
            };

            for (const result of results) {
                parsedResults.gallery.push({
                    id: result.img_id,
                    src: result.src,
                    alt: result.alt
                });
            }

            res.send(parsedResults);
        });
    });
};

/**
 * Return a list with all the theatres
 * 
 * @name all
 * @function
 * @param {Object} req - The request object of Express.
 * @param {Object} res - The response object of Express.
 * @param {Function} next - Express callback argument.
 */
exports.all = (req, res, next) => {
    mysqlService.executeQuery(queries.getAllTheatre, [], (err, results) => {
        if (err) {
            return res.status(500).send('Internal Server Error.');
        }

        let parsedResults = {};

        for (const result of results) {
            if (!parsedResults[result.id]) {
                parsedResults[result.id] = {
                    id: result.id,
                    name: result.name,
                    address: result.address,
                    phone: result.phone,
                    email: result.email,
                    site_url: result.site_url,
                    history: result.history,
                    country: result.country,
                    province: result.province,
                    profile_image: result.profile_image,
                    cover_image: result.cover_image,
                    city: result.city,
                    circuit_type: result.circuit_type,
                    gallery: {},
                    rooms: {}
                };  
            }

            if (result.img_id && !parsedResults[result.id].gallery[result.img_id]) {
                parsedResults[result.id].gallery[result.img_id] = {
                    id: result.img_id,
                    src: result.src,
                    alt: result.alt
                };
            }

            if (result.room_id && !parsedResults[result.id].rooms[result.room_id]) {
                parsedResults[result.id].rooms[result.room_id] = {
                    id: result.room_id,
                    name: result.room_name,
                    capacity: result.capacity,
                    black_camera: result.black_camera,
                    relevant_data: result.relevant_data,
                    profile_image: result.profile_image,
                    scenic_space: result.scenic_space,
                    escenary_type: result.escenary_type
                };
            }
        }

        parsedResults = Object.values(parsedResults);

        for (const result of parsedResults) {
            result.rooms = Object.values(result.rooms);
            result.gallery = Object.values(result.gallery);
        }

        res.send(parsedResults);
    });
};

/**
 * Return a info of the logged theatre
 * 
 * @name profile
 * @function
 * @param {Object} req - The request object of Express.
 * @param {Object} req.session - User session data.
 * @param {Integer} req.session.id - User ID.
 * @param {Object} res - The response object of Express.
 * @param {Function} next - Express callback argument.
 */
exports.profile = (req, res, next) => {
    let userId = req.session.id;
    
    mysqlService.executeQuery(queries.getTheatreByUserId, [userId], (err, results) => {
        if (err) {
            return res.status(500).send('Internal Server Error.');
        }

        if (!results.length) {
            return res.status(400).send('Can\'t find the theatre.');
        }

        let parsedResults = {
            id: results[0].id,
            name: results[0].name,
            address: results[0].address,
            phone: results[0].phone,
            email: results[0].email,
            site_url: results[0].site_url,
            history: results[0].history,
            country: results[0].country,
            province: results[0].province,
            profile_image: results[0].profile_image,
            cover_image: results[0].cover_image,
            city: results[0].city,
            circuit_type: results[0].circuit_type,
            gallery: {},
            rooms: {}
        };

        for (const result of results) {
            if (result.img_id && !parsedResults.gallery[result.img_id]) {
                parsedResults.gallery[result.img_id] = {
                    id: result.img_id,
                    src: result.src,
                    alt: result.alt
                };
            }

            if (result.room_id && !parsedResults.rooms[result.room_id]) {
                parsedResults.rooms[result.room_id] = {
                    id: result.room_id,
                    name: result.room_name,
                    capacity: result.capacity,
                    black_camera: result.black_camera,
                    relevant_data: result.relevant_data,
                    profile_image: result.profile_image,
                    scenic_space: result.scenic_space,
                    escenary_type: result.escenary_type
                };
            }
        }

        parsedResults.rooms = Object.values(parsedResults.rooms);
        parsedResults.gallery = Object.values(parsedResults.gallery);

        res.send(parsedResults);
    });
};

/**
 * Return a theatre info by id
 * 
 * @name get
 * @function
 * @param {Object} req - The request object of Express.
 * @param {Object} req.params - The params of the request.
 * @param {Integer} req.params.id - ID of the theatre.
 * @param {Object} res - The response object of Express.
 * @param {Function} next - Express callback argument.
 */
exports.get = (req, res, next) => {
    let theatreId = req.params.id;

    mysqlService.executeQuery(queries.getTheatreById, [theatreId], (err, results) => {
        if (err) {
            return res.status(500).send('Internal Server Error.');
        }

        if (!results.length) {
            return res.status(500).send('Can\'t find the theatre.');
        }

        let parsedResults = {
            id: results[0].id,
            name: results[0].name,
            address: results[0].address,
            phone: results[0].phone,
            email: results[0].email,
            site_url: results[0].site_url,
            history: results[0].history,
            country: results[0].country,
            province: results[0].province,
            profile_image: results[0].profile_image,
            cover_image: results[0].cover_image,
            city: results[0].city,
            circuit_type: results[0].circuit_type,
            gallery: {},
            rooms: {}
        };

        for (const result of results) {
            if (result.img_id && !parsedResults.gallery[result.img_id]) {
                parsedResults.gallery[result.img_id] = {
                    id: result.img_id,
                    src: result.src,
                    alt: result.alt
                };
            }

            if (result.room_id && !parsedResults.rooms[result.room_id]) {
                parsedResults.rooms[result.room_id] = {
                    id: result.room_id,
                    name: result.room_name,
                    capacity: result.capacity,
                    black_camera: result.black_camera,
                    relevant_data: result.relevant_data,
                    profile_image: result.profile_image,
                    scenic_space: result.scenic_space,
                    escenary_type: result.escenary_type
                };
            }
        }

        parsedResults.rooms = Object.values(parsedResults.rooms);
        parsedResults.gallery = Object.values(parsedResults.gallery);

        res.send(parsedResults);
    });
};

exports.registerRoom = () => {};
exports.updateRoom = () => {};

/**
 * Returns a theatre room info by id
 * 
 * @name getRoom
 * @function
 * @param {Object} req - The request object of Express.
 * @param {Object} req.params - The params of the request.
 * @param {Integer} req.params.id - ID of the theatre room.
 * @param {Object} res - The response object of Express.
 * @param {Function} next - Express callback argument.
 */
exports.getRoom = (req, res, next) => {
    let theatreRoomId = req.params.id;

    mysqlService.executeQuery(queries.getTheatreRoomById, [theatreRoomId], (err, results) => {
        if (err) {
            return res.status(500).send('Internal Server Error.');
        }

        if (!results.length) {
            return res.status(400).send('Can\'t find the room.');
        }

        let parsedResults = {
            id: results[0].id,
            name: results[0].name,
            capacity: results[0].capacity,
            black_camera: results[0].black_camera,
            relevant_data: results[0].relevant_data,
            profile_image: results[0].profile_image,
            scenic_space: results[0].scenic_space,
            escenary_type: results[0].escenary_type,
            theatre: {
                id: results[0].theatre_id,
                name: results[0].theatre_name,
                address: results[0].address,
                phone: results[0].phone,
                email: results[0].email,
                site_url: results[0].site_url,
                history: results[0].history,
                country: results[0].country,
                province: results[0].province,
                profile_image: results[0].profile_image,
                cover_image: results[0].cover_image,
                city: results[0].city,
                circuit_type: results[0].circuit_type,
                gallery: []
            }
        };

        for (const result of results) {
            if (result.img_id) {
                parsedResults.theatre.gallery.push({
                    id: result.img_id,
                    src: result.src,
                    alt: result.alt
                });
            }
        }

        res.send(parsedResults);
    });
};

//exports.registerShowRoom = () => {};