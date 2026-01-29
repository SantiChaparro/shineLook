const {TenantProfessional,Appointment} = require('../db');

const getProfessionalRating = async(tenantId,professionalId) => {
    const existingRelation = await TenantProfessional.findOne({
        where:{
            TenantId:tenantId,
            ProfessionalDni:professionalId
        }
    });

    console.log(existingRelation);
    

    if(existingRelation){
          return {
        ratingAverage: existingRelation.ratingAverage,
        
    };
    }
};

const submitRating = async ({ appointmentId, tenantId, professionalDni, score }) => {
    try {
        console.log("📩 controller Datos recibidos desde el link:", {
            appointmentId,
            tenantId,
            professionalDni,
            score
        });

        // Asegurar que score sea número
        score = Number(score);

        // Buscar el appointment
        const appointment = await Appointment.findByPk(appointmentId);

        if (!appointment) {
            throw new Error("Appointment not found");
        }

        if (appointment.hasBeenRated === true) {
            throw new Error("Appointment has already been rated");
        }

        // Buscar la relación Tenant - Professional
        const existingRelation = await TenantProfessional.findOne({
            where: {
                TenantId: tenantId,
                ProfessionalDni: professionalDni
            }
        });

        if (!existingRelation) {
            throw new Error("Professional relationship not found");
        }

        // Calcular nuevos valores
        const newTotalRating = existingRelation.totalRating + score;
        const newRatingCount = existingRelation.ratingCount + 1;
        const newAverage = newTotalRating / newRatingCount;

        console.log('newTotalRating:', newTotalRating);
        console.log('newRatingCount:', newRatingCount);
        console.log('newAverage:', newAverage);
        

        // Actualizar datos
        await existingRelation.update({
            totalRating: newTotalRating,
            ratingCount: newRatingCount,
            ratingAverage: newAverage
        });

        // Marcar appointment como calificado
       const updated = await Appointment.update(
            { hasBeenRated: true },
            { where: { id: appointmentId, hasBeenRated: false } }
        );

        if (updated[0] === 0) {
            throw new Error("Appointment has already been rated");
        }


        return {
            message: "Rating submitted successfully",
            ratingAverage: newAverage,
            ratingCount: newRatingCount
        };

    } catch (error) {
        console.error("❌ ERROR en submitRating:", error.message, error);
        throw error;
    }
};



module.exports = {getProfessionalRating,submitRating}