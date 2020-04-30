const Joi = require('@hapi/joi');

export default Joi.array().items(Joi.object().keys({
  type: Joi.string().required(),
  id: Joi.string().required(),
  title: Joi.string().required(),
  content: Joi.array().items(Joi.object().keys({
    type: Joi.string().required(),
    id: Joi.string().required(),
    asset: Joi.object().keys({
      id: Joi.string().required(),
      title: Joi.string().required(),
      contentType: Joi.string().required(),
      url: Joi.string().required(),
    }).required(),
    grid: Joi.object().keys({
      desktopTl: Joi.object().keys({
        x: Joi.string().pattern(/^[0-9]+$/).required(),
        y: Joi.string().pattern(/^[0-9]+$/).required(),
      }).required(),
      desktopBr: Joi.object().keys({
        x: Joi.string().pattern(/^[0-9]+$/).required(),
        y: Joi.string().pattern(/^[0-9]+$/).required(),
      }).required(),
      mobileTl: Joi.object().keys({
        x: Joi.string().pattern(/^[0-9]+$/).required(),
        y: Joi.string().pattern(/^[0-9]+$/).required(),
      }).required(),
      mobileBr: Joi.object().keys({
        x: Joi.string().pattern(/^[0-9]+$/).required(),
        y: Joi.string().pattern(/^[0-9]+$/).required()
      }).required(),
    }).required(),
    margins: Joi.object().keys({
      mTop: Joi.boolean().required(),
      mLeft: Joi.boolean().required(),
      mBottom: Joi.boolean().required(),
      mRight: Joi.boolean().required()
    }).required(),
    fullBleed: Joi.boolean().required(),
    anchor: Joi.string().required(),
    objectFit: Joi.string().required()
  }))
}))