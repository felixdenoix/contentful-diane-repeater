const Joi = require('@hapi/joi');

const ContentfulAssetSchema = Joi.object({
  id: Joi.string().required(),
  title: Joi.string().required(),
  contentType: Joi.string().required(),
  url: Joi.string().required(),
  dimentions: Joi.object({
    width: Joi.number().required(),
    height: Joi.number().required()
  }),
  size: Joi.number()
});

const MarginsObject = Joi.object({
  mTop: Joi.boolean().required(),
  mLeft: Joi.boolean().required(),
  mBottom: Joi.boolean().required(),
  mRight: Joi.boolean().required()
});

const GridPosition = Joi.object({
  x: Joi.string()
    .pattern(/^[0-9]+$/)
    .required(),
  y: Joi.string()
    .pattern(/^[0-9]+$/)
    .required()
});

export default Joi.array().items(
  Joi.object({
    type: Joi.string().required(),
    id: Joi.string().required(),
    title: Joi.string()
      .required()
      .allow(''),
    content: Joi.array().items(
      Joi.object({
        type: Joi.string().required(),
        id: Joi.string().required(),
        asset: ContentfulAssetSchema.required(),
        stampAsset: ContentfulAssetSchema,
        grid: Joi.object({
          desktopTl: GridPosition.required(),
          desktopBr: GridPosition.required(),
          mobileTl: GridPosition.required(),
          mobileBr: GridPosition.required()
        }).required(),
        fullBleed: Joi.boolean().required(),
        margins: MarginsObject,
        marginsMobile: MarginsObject,
        anchor: Joi.string().required(),
        anchorMobile: Joi.string().required(),
        objectFit: Joi.string().required(),
        objectFitMobile: Joi.string().required(),
        zIndex: Joi.string().required(),
        stampEffect: Joi.boolean().required(),
        autoPlay: Joi.boolean().required()
      })
    )
  })
);
