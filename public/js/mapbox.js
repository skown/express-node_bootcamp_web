export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYWRyaWFuLXNrb3dyb24iLCJhIjoiY2xmdGl3MHI1MDA0MjNsczFoenJ3dWEweSJ9.s1LA2DnzEqGhz2zZq8JDqA';

  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/adrian-skowron/clftjpbls00a701t6t3ix2wzf', // style URL
    scrollZoom: false,
    //   center: [-118.113491, 34.111745], // starting position [lng, lat]
    //   zoom: 9, // starting zoom
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((location) => {
    // Create a marker for each location
    const el = document.createElement('div');
    el.className = 'marker';

    // Add a marker for each location
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(location.coordinates)
      .addTo(map);

    // Add a popup for each location
    new mapboxgl.Popup({ offset: 25 })
      .setLngLat(location.coordinates)
      .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
      .addTo(map);

    // Extend map bounds to include location
    bounds.extend(location.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
