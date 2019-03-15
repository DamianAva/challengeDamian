'use strict';

const mysqlService = require('../service/mysql');
const queries = require('../config/queries');

/**
 * Returns an event by ID.
 * 
 * @name get
 * @function
 * @param {Object} req - The request object of Express.
 * @param {Object} req.params - The params of the request.
 * @param {Integer} req.params.id - Event ID.
 * @param {Object} res - The response object of Express.
 * @param {Function} next - Express callback argument.
 */
exports.get = (req, res, next) => {
    let eventId = req.params.id;

    mysqlService.executeQuery(queries.getEventById, [eventId], (err, results) => {
        if (err) {
            return res.status(500).send('Database Error.');
        }

        if (!results.length) {
            return res.status(500).send('Can\'t find the event.');
        }

        let parsedResults = {
            id: results[0].id,
            author: results[0].author,
            duration: results[0].duration,
            director: results[0].director,
            name: results[0].name,
            profile_image: results[0].profile_image,
            premiere: results[0].premiere,
            distance: results[0].distance,
            cachet: {
                national_cachet: results[0].national_cachet,
                international_cachet: results[0].international_cachet,
                borderaux: results[0].borderaux
            },
            cover_image: results[0].cover_image,
            trailer: results[0].trailer,
            cast: results[0].cast,
            synthesis: results[0].synthesis,
            city: results[0].city,
            genre: results[0].genre,
            public_type: results[0].public_type,
            tour: [], // TODO
            requirements: {},
            technicalRequeriments: {
                needed_people: results[0].needed_people,
                assembly_hours: results[0].assembly_hours,
                disassembly_hours: results[0].disassembly_hours,
                needed_space: results[0].needed_space,
                sound: results[0].sound,
                scenography: results[0].scenography
            },
            gallery: {}
        };

        for (const result of results) {
            if(result.requirement_id && !parsedResults.requirements[result.requirement_id]){
                parsedResults.requirements[result.requirement_id] = {
                    covered_level: result.covered_level,
                    comment: result.comment,
                    description: result.requirement_description
                };
            }

            if(result.image_id && !parsedResults.gallery[result.image_id]){
                parsedResults.gallery[result.image_id] = {
                    id: result.image_id,
                    src: result.src,
                    alt: result.alt
                };
            }
        }

        parsedResults.requirements = Object.values(parsedResults.requirements);
        parsedResults.gallery = Object.values(parsedResults.gallery);

        res.send(parsedResults);
    });
};

/**
 * Returns all the events.
 * 
 * @name all
 * @function
 * @param {Object} req - The request object of Express.
 * @param {Object} res - The response object of Express.
 * @param {Function} next - Express callback argument.
 */
exports.all = (req, res, next) => {
    mysqlService.executeQuery(queries.getAllEvents, [], (err, results) => {
        if (err) {
            return res.status(500).send('Database Error.');
        }

        let parsedResults = {};

        for (const result of results) {
            if (!parsedResults[result.id]) {
                parsedResults[result.id] = {
                    id: result.id,
                    author: result.author,
                    duration: result.duration,
                    director: result.director,
                    name: result.name,
                    profile_image: result.profile_image,
                    premiere: result.premiere,
                    distance: result.distance,
                    cachet: {
                        national_cachet: result.national_cachet,
                        international_cachet: result.international_cachet,
                        borderaux: result.borderaux
                    },
                    cover_image: result.cover_image,
                    trailer: result.trailer,
                    cast: result.cast,
                    synthesis: result.synthesis,
                    city: result.city,
                    genre: result.genre,
                    public_type: result.public_type,
                    tour: [], // TODO
                    requirements: {},
                    technicalRequeriments: {
                        needed_people: result.needed_people,
                        assembly_hours: result.assembly_hours,
                        disassembly_hours: result.disassembly_hours,
                        needed_space: result.needed_space,
                        sound: result.sound,
                        scenography: result.scenography
                    },
                    gallery: {}
                };
            }

            if(result.requirement_id && !parsedResults[result.id].requirements[result.requirement_id]){
                parsedResults[result.id].requirements[result.requirement_id] = {
                    covered_level: result.covered_level,
                    comment: result.comment,
                    description: result.requirement_description
                };
            }

            if(result.image_id && !parsedResults[result.id].gallery[result.image_id]){
                parsedResults[result.id].gallery[result.image_id] = {
                    id: result.image_id,
                    src: result.src,
                    alt: result.alt
                };
            }
        }

        parsedResults = Object.values(parsedResults);

        for (const result of parsedResults) {
            result.requirements = Object.values(result.requirements);
            result.gallery = Object.values(result.gallery);
        }

        res.send(parsedResults);
    });
};

exports.updateInfo = (req, res, next) => {

};

//exports.cachet = () => {};
//exports.agenda = () => {};
exports.modifyTechnicalRequirements = () => {};
exports.modifyRequirements = () => {};
exports.modifyImages = () => {};
exports.addImage = () => {};
exports.deleteImage = () => {};
exports.add = () => {};