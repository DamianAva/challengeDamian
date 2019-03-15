'use strict';

const mysqlService = require('../service/mysql');
const queries = require('../config/queries');

exports.get = () => {};

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

exports.updateInfo = () => {};
//exports.cachet = () => {};
//exports.agenda = () => {};
exports.modifyTechnicalRequirements = () => {};
exports.modifyRequirements = () => {};
exports.modifyImages = () => {};
exports.addImage = () => {};
exports.deleteImage = () => {};
exports.add = () => {};