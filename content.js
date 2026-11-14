export const sources = [
  { name: 'GPM / IMERG', role: 'Rainfall context', body: 'Satellite-based precipitation estimates help put a season in historical context.', limit: 'Regional estimates, not rain measurements for each small parcel.', url: 'https://gpm.nasa.gov/data/imerg', agency: 'NASA' },
  { name: 'POWER', role: 'Climate context', body: 'Meteorological and solar data provide background for exploring growing conditions.', limit: 'Gridded observations and models, not a field-level weather forecast.', url: 'https://power.larc.nasa.gov/', agency: 'NASA' },
  { name: 'SMAP', role: 'Surface soil moisture', body: 'Surface moisture adds a regional perspective on how wet or dry conditions are.', limit: 'Surface moisture does not measure all the water available to crop roots.', url: 'https://smap.jpl.nasa.gov/', agency: 'NASA' },
  { name: 'HLS', role: 'Vegetation over time', body: 'Harmonized Landsat and Sentinel-2 imagery can help observe changes across seasons.', limit: 'Clouds, image quality and spatial resolution still matter.', url: 'https://hls.gsfc.nasa.gov/', agency: 'NASA / USGS / ESA inputs' },
];
export const supportingSources = [
  { name: 'USDA soil surveys', body: 'Soil properties and mapping context. Local conditions still need confirmation.', url: 'https://www.nrcs.usda.gov/resources/data-and-reports/soil-survey-geographic-database-ssurgo' },
  { name: 'Iowa State University Extension', body: 'Regional guidance for an illustrative corn–soybean rotation with a cereal rye cover crop before soybeans.', url: 'https://crops.extension.iastate.edu/post/planning-successful-cover-crops' },
];
export const pains = [
  { title: 'The season changes. The decision stays yours.', problem: 'Planting decisions come before the season reveals how dry or wet it will be.', answer: 'Explore the same rotation under explicit dry and wet assumptions, before committing to a plan.', icon: 'weather' },
  { title: 'A forecast cannot tell the whole field story.', problem: 'Rainfall alone leaves out soil, drainage, crop history and what the farmer knows.', answer: 'Bring environmental context and farmer-provided information into one view of the field.', icon: 'layers' },
  { title: 'A different rotation brings different trade-offs.', problem: 'It is hard to compare alternatives when their assumptions and missing information are hidden.', answer: 'Make the reasoning visible: what changes, why it matters, and what still needs checking.', icon: 'rotation' },
];
