const Joi = require('@hapi/joi');

export default Joi.array().items(Joi.object({
  type: Joi.string().required(),
  id: Joi.string().required(),
  title: Joi.string().required().allow(''),
  content: Joi.array().items(Joi.object({
    type: Joi.string().required(),
    id: Joi.string().required(),
    asset: Joi.object({
      id: Joi.string().required(),
      title: Joi.string().required(),
      contentType: Joi.string().required(),
      url: Joi.string().required(),
    }).required(),
    grid: Joi.object({
      desktopTl: Joi.object({
        x: Joi.string().pattern(/^[0-9]+$/).required(),
        y: Joi.string().pattern(/^[0-9]+$/).required(),
      }).required(),
      desktopBr: Joi.object({
        x: Joi.string().pattern(/^[0-9]+$/).required(),
        y: Joi.string().pattern(/^[0-9]+$/).required(),
      }).required(),
      mobileTl: Joi.object({
        x: Joi.string().pattern(/^[0-9]+$/).required(),
        y: Joi.string().pattern(/^[0-9]+$/).required(),
      }).required(),
      mobileBr: Joi.object({
        x: Joi.string().pattern(/^[0-9]+$/).required(),
        y: Joi.string().pattern(/^[0-9]+$/).required()
      }).required(),
    }).required(),
    margins: Joi.object({
      mTop: Joi.boolean().required(),
      mLeft: Joi.boolean().required(),
      mBottom: Joi.boolean().required(),
      mRight: Joi.boolean().required()
    }).required(),
    marginsMobile: Joi.object({
      mTop: Joi.boolean().required(),
      mLeft: Joi.boolean().required(),
      mBottom: Joi.boolean().required(),
      mRight: Joi.boolean().required()
    }).required(),
    anchor: Joi.string().required(),
    anchorMobile: Joi.string().required(),
    objectFit: Joi.string().required(),
    objectFitMobile: Joi.string().required(),
    fullBleed: Joi.boolean().required(),
    zIndex: Joi.string().required(),
    stampEffect: Joi.boolean().required()
  }))
}))