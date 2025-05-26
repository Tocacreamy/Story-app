/**
 * Map utility for handling map operations and location selection
 */
export default class MapHandler {
  constructor() {
    this.map = null;
    this.marker = null;
    this.leaflet = null;
  }

  /**
   * Initialize the map and load Leaflet library
   * @param {string} elementId - The ID of the HTML element to render the map on
   * @param {Object} options - Map initialization options
   * @returns {Promise} - Resolves when map is ready
   */
  async init(elementId, options = {}) {
    const defaultOptions = {
      center: [-6.2088, 106.8456], // Default to Jakarta
      zoom: 13,
    };

    const mapOptions = { ...defaultOptions, ...options };

    // Load Leaflet CSS if not already loaded
    await this._loadLeafletCSS();

    // Dynamic import of Leaflet
    try {
      this.leaflet = await import("leaflet");

      // Create map instance
      this.map = this.leaflet.map(elementId);

      // Add tile layer (map background)
      this.leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
        .addTo(this.map);

      // Set initial view
      this.map.setView(mapOptions.center, mapOptions.zoom);

      // Allow marker to be added by click
      this.map.on("click", (e) => {
        this.setMarker(e.latlng.lat, e.latlng.lng);
      });

      return { success: true, map: this.map };
    } catch (error) {
      console.error("Error initializing map:", error);
      return {
        success: false,
        error: `Could not initialize map: ${error.message}`,
      };
    }
  }

  /**
   * Set a marker at the specified coordinates
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {boolean} centerMap - Center the map on the marker
   */
  setMarker(lat, lng, centerMap = true) {
    if (!this.map || !this.leaflet) return;

    // Remove existing marker if any
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Create custom marker icon
    const icon = this.leaflet.divIcon({
      className: "custom-marker",
      html: `<div class="custom-marker-pin"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });

    // Add new marker
    this.marker = this.leaflet
      .marker([lat, lng], { icon })
      .addTo(this.map)
      .bindTooltip("Selected Location", { className: "marker-tooltip" });

    // Center map if needed
    if (centerMap) {
      this.map.setView([lat, lng], this.map.getZoom());
    }
  }

  /**
   * Get user's current location and add a marker
   * @returns {Promise} - Resolves with location or error
   */
  async getUserLocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({
          success: false,
          error: "Geolocation is not supported by your browser",
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          if (this.map) {
            this.setMarker(latitude, longitude, true);
            this.map.setZoom(15); // Zoom closer to user's location
          }

          resolve({
            success: true,
            latitude,
            longitude,
          });
        },
        (error) => {
          resolve({
            success: false,
            error: `Could not get your location: ${error.message}`,
          });
        }
      );
    });
  }

  /**
   * Get the current marker coordinates
   * @returns {Object|null} - Coordinates or null if no marker
   */
  getMarkerPosition() {
    if (!this.marker) return null;

    const position = this.marker.getLatLng();
    return {
      latitude: position.lat,
      longitude: position.lng,
    };
  }

  /**
   * Clear the marker from the map
   */
  clearMarker() {
    if (this.marker && this.map) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
  }

  /**
   * Reset the map view
   * @param {Array} center - [lat, lng] center coordinates
   * @param {number} zoom - Zoom level
   */
  resetView(center = [-6.2088, 106.8456], zoom = 13) {
    if (this.map) {
      this.map.setView(center, zoom);
    }
  }

  /**
   * Load Leaflet CSS dynamically
   * @returns {Promise} - Resolves when CSS is loaded
   */
  _loadLeafletCSS() {
    return new Promise((resolve) => {
      if (document.querySelector('link[href*="leaflet.css"]')) {
        resolve();
        return;
      }

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
      link.crossOrigin = "";
      link.onload = resolve;

      document.head.appendChild(link);
    });
  }
}
