const Joi = require('joi');

const doctorschema = Joi.object({
    doctor_name: Joi.string().max(50).required().messages({
        'string.base': 'Name must be a string.',
        'string.max': 'Name cannot be more than 50 characters.',
        'any.required': 'Name is required.'
    }),

    doctor_email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format.',
        'any.required': 'Email is required.'
    }),
    specialty : Joi.string().max(50).required().messages({
        'string.base': 'Name must be a string.',
        'string.max': 'Name cannot be more than 50 characters.',
        'any.required': 'Name is required.'
    }),
    hospital_id: Joi.number().integer().required().messages({
        'number.base': 'hospital_id must be a number.',
        'any.required': 'hospital_id is required.'
    }),
    availability: Joi.array().min(1).items(
        Joi.object({
          day: Joi.string().required(),
          startTime: Joi.string().required(),
          endTime: Joi.string().required()
        })
      ).required().messages({
        'array.min': 'At least one availability entry is required.',
        'any.required': 'Availability is required.'
      })
        // Default empty array if not provided
    
});
// const Joi = require("joi");

// const hospitalschema = Joi.object({
//   patient_id: Joi.number().integer().required(),
// });

const hospitalschema = Joi.object({
 
  hospital_name: Joi.string().required().messages({
    'string.base': 'hospital name must be string',
    'any.required': 'hospital name is required.'
}),
  location: Joi.string().required().messages({
    'string.base': 'location must be string',
    'any.required': 'location is required.'
}),
 
});

const RegisterSchema = Joi.object({
    user_name: Joi.string().max(50).required().messages({
        'string.base': 'Name must be a string.',
        'string.max': 'Name cannot be more than 50 characters.',
        'any.required': 'Name is required.'
    }),

    user_number: Joi.string().pattern(/^\d{10}$/).required().messages({
        'string.pattern.base': 'Number must be exactly 10 digits.',
        'any.required': 'Number is required.'
    }),

    user_email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format.',
        'any.required': 'Email is required.'
    }),

    user_password: Joi.string().min(6).max(20).pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/).required().messages({
        'string.min': 'Password must be at least 6 characters long.',
        'string.max': 'Password cannot exceed 20 characters.',
        'string.pattern.base': 'Password must contain at least one letter and one number.',
        'any.required': 'Password is required.'
    }) 
});
const LoginSchema = Joi.object({

    user_email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format.',
        'any.required': 'Email is required.'
    }),

    user_password: Joi.string().min(6).max(20).pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/).required().messages({
        'string.min': 'Password must be at least 6 characters long.',
        'string.max': 'Password cannot exceed 20 characters.',
        'string.pattern.base': 'Password must contain at least one letter and one number.',
        'any.required': 'Password is required.'
    }) 
})
const appointmntschema = Joi.object({
    doctorId: Joi.number().required(),
    userEmail: Joi.string().email().required(),
    availability: Joi.object({
      day: Joi.string().required(),
      startTime: Joi.string().required(),
      endTime: Joi.string().required()
    }).required()
  });
  

module.exports = {hospitalschema,doctorschema,RegisterSchema,LoginSchema,appointmntschema};
