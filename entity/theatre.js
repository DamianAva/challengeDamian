'use strict';

const mysqlService = require('../service/mysql');
const queries = require('../config/queries');

exports.update = () => {};

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
            return res.status(500).send('Database Error.');
        }

        let parsedResults = {};

        for (const result of results) {
            if (!parsedResults[id]) {
                parsedResults[id] = {
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
                    gallery: [],
                    rooms: []
                };  
            }

            if (result.img_id) {
                parsedResults[id].gallery.push({
                    id: result.img_id,
                    src: result.src,
                    alt: result.alt
                });
            }

            if (result.room_id) {
                parsedResults[id].gallery.push({
                    id: result.room_id,
                    name: result.room_name,
                    capacity: result.capacity,
                    black_camera: result.black_camera,
                    relevant_data: result.relevant_data,
                    profile_image: result.profile_image,
                    scenic_space: result.scenic_space,
                    escenary_type: result.escenary_type
                });
            }
        }

        parsedResults = Object.values(parsedResults);

        res.send(parsedResults);
    });
};

exports.profile = () => {};

/**
 * Return a theatre info by id
 * 
 * @name get
 * @function
 * @param {Object} req - The request object of Express.
 * @param {Object} req.params - The params of the request.
 * @param {Object} req.params.id - ID of the theatre.
 * @param {Object} res - The response object of Express.
 * @param {Function} next - Express callback argument.
 */
exports.get = (req, res, next) => {
    let theatreId = req.params.id;

    mysqlService.executeQuery(queries.getTheatreById, [theatreId], (err, results) => {
        if (err) {
            return res.status(500).send('Database Error.');
        }

        let parsedResults = {};

        for (const result of results) {
            if (!parsedResults[id]) {
                parsedResults[id] = {
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
                    gallery: [],
                    rooms: []
                };  
            }

            if (result.img_id) {
                parsedResults[id].gallery.push({
                    id: result.img_id,
                    src: result.src,
                    alt: result.alt
                });
            }

            if (result.room_id) {
                parsedResults[id].gallery.push({
                    id: result.room_id,
                    name: result.room_name,
                    capacity: result.capacity,
                    black_camera: result.black_camera,
                    relevant_data: result.relevant_data,
                    profile_image: result.profile_image,
                    scenic_space: result.scenic_space,
                    escenary_type: result.escenary_type
                });
            }
        }

        parsedResults = Object.values(parsedResults);

        res.send(parsedResults);
    });
};

exports.add = () => {};

//----

exports.registerRoom = () => {};
exports.updateRoom = () => {};

/**
 * Return a theatre room info by id
 * 
 * @name getRoom
 * @function
 * @param {Object} req - The request object of Express.
 * @param {Object} req.params - The params of the request.
 * @param {Object} req.params.id - ID of the theatre room.
 * @param {Object} res - The response object of Express.
 * @param {Function} next - Express callback argument.
 */
exports.getRoom = (req, res, next) => {
    let theatreRoomId = req.params.id;

    mysqlService.executeQuery(queries.getTheatreRoomById, [theatreRoomId], (err, results) => {
        if (err) {
            return res.status(500).send('Database Error.');
        }

        if (!results.length) {
            return res.send({});
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