module.exports = {
    getAllEvents: `SELECT
        eve.id,
        eve.author,
        eve.duration,
        eve.director,
        eve.name,
        eve.profile_image,
        eve.premiere,
        eve.distance,
        eve.national_cachet,
        eve.international_cachet,
        eve.borderaux,
        eve.cover_image,
        eve.trailer,
        eve.cast,
        eve.synthesis,
        eve.city,
        eve.genre,
        eve.public_type,
        eve.needed_people,
        eve.assembly_hours,
        eve.disassembly_hours,
        eve.needed_space,
        eve.sound,
        eve.scenography,
        evereq.id AS requirement_id,
        evereq.covered_level,
        evereq.comment,
        reqdes.name AS requirement_description,
        eveimg.id AS image_id,
        eveimg.src,
        eveimg.alt
    FROM 
        event AS eve
    LEFT JOIN
        event_requirement AS evereq ON evereq.event_id = eve.id
    LEFT JOIN
        event_image AS eveimg ON eveimg.event_id = eve.id
    LEFT JOIN
        requirement_description AS reqdes ON evereq.description_id = reqdes.id;`,

    getEventById: `SELECT
        eve.id,
        eve.author,
        eve.duration,
        eve.director,
        eve.name,
        eve.profile_image,
        eve.premiere,
        eve.distance,
        eve.national_cachet,
        eve.international_cachet,
        eve.borderaux,
        eve.cover_image,
        eve.trailer,
        eve.cast,
        eve.synthesis,
        eve.city,
        eve.genre,
        eve.public_type,
        eve.needed_people,
        eve.assembly_hours,
        eve.disassembly_hours,
        eve.needed_space,
        eve.sound,
        eve.scenography,
        evereq.id AS requirement_id,
        evereq.covered_level,
        evereq.comment,
        reqdes.name AS requirement_description,
        eveimg.id AS image_id,
        eveimg.src,
        eveimg.alt
    FROM 
        event AS eve
    LEFT JOIN
        event_requirement AS evereq ON evereq.event_id = eve.id
    LEFT JOIN
        event_image AS eveimg ON eveimg.event_id = eve.id
    LEFT JOIN
        requirement_description AS reqdes ON evereq.description_id = reqdes.id
    WHERE
        eve.id = ?;`,
};