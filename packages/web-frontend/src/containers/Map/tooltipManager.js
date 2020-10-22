/* eslint-disable no-param-reassign */
import Labelgun from 'labelgun';

const hideLabel = label => {
  label.labelObject.style.opacity = 0;
  label.labelObject.style.transition = 'opacity 0s';
};

const showLabel = label => {
  label.labelObject.style.opacity = 1;
  label.labelObject.style.transition = 'opacity 1s';
};

export const labelEngine = new Labelgun(hideLabel, showLabel);

const id = 0;
const labels = [];
const totalMarkers = 0;

// function resetLabels(markers) {
//   labelEngine.reset();
//   let i = 0;
//   for (let j = 0; j < markers.length; j++) {
//     markers[j].eachLayer(function (label) {
//       addLabel(label, ++i);
//     });
//   }
//   labelEngine.update();
// }

export function addLabel(tooltip, id) {
  // This is ugly but there is no getContainer method on the tooltip :(
  console.log(tooltip);
  return;
  if (layer.getTooltip()) {
    // eslint-disable-next-line no-underscore-dangle
    const label = layer.getTooltip()._source._tooltip._container;
    if (label) {
      // We need the bounding rectangle of the label itself
      const rect = label.getBoundingClientRect();

      // We convert the container coordinates (screen space) to Lat/lng
      const bottomLeft = map.containerPointToLatLng([rect.left, rect.bottom]);
      const topRight = map.containerPointToLatLng([rect.right, rect.top]);
      const boundingBox = {
        bottomLeft: [bottomLeft.lng, bottomLeft.lat],
        topRight: [topRight.lng, topRight.lat],
      };

      console.log(boundingBox);
      // Ingest the label into labelgun itself
      labelEngine.ingestLabel(
        boundingBox,
        id,
        parseInt(Math.random() * (5 - 1) + 1), // Weight
        label,
        `Test ${id}`,
        false,
      );

      // If the label hasn't been added to the map already
      // add it and set the added flag to true
      if (!layer.added) {
        layer.addTo(map);
        layer.added = true;
      }
    }
  }
}
