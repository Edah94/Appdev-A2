

function init (){
    var attribution = new ol.control.Attribution({
        collapsible: false
        });
        

    const view = new ol.View({
        center: [0, 0],
        maxZoom: 18,
        zoom: 0
    })

    var map = new ol.Map({
    controls: ol.control.defaults({attribution: false}).extend([attribution]),
    layers: [
        new ol.layer.Tile({
        source: new ol.source.OSM({
            url: 'https://tile.openstreetmap.be/osmbe/{z}/{x}/{y}.png',
            attributions: [ ol.source.OSM.ATTRIBUTION, 'Tiles courtesy of <a href="https://geo6.be/">GEO-6</a>' ],
            maxZoom: 18
        })
        })
    ],
    target: 'map',
    view: view
    });
    
    //Base layers
    //1st raster tile layer - OSM Standard
    var OSMStandard = new ol.layer.Tile({
        source: new ol.source.OSM({
            url: 'https://{a-c}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        }),
        visible: true,
        title: 'OSMStandard'
    })
    
    //2nd raster tile layer - Stamen watercolor
    var Stamen = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
            attributions: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
        }),
        visible: false,
        title: 'Stamen'
    })
    
    
    

    //overlayGroup - grouping of the (raster) Tile layers listed
    var baseLayerGroup = new ol.layer.Group({
        layers: [Stamen, OSMStandard]
    })
    map.addLayer(baseLayerGroup);

    //Layer switcher 
    const baseLayerElements = document.querySelectorAll('.sidebar1 > input[type=radio]')
    for(let baseLayerElement of baseLayerElements){
        baseLayerElement.addEventListener('change', function(){
            let baseLayerValue = this.value;
            baseLayerGroup.getLayers().forEach(function(element, index, array){
                let baselayerName = element.get('title');
                element.setVisible(baselayerName === baseLayerValue)
            })
        })
    }


   


    //layerSwitcher control - enables switching and turning on/off between incorporated layers
    //including raster and vector layers
    var layerSwitcher = new ol.control.LayerSwitcher({
        activationMode: 'click',
        startActive: false,
        groupSelectStyle: 'children'
    });
    
    //map.addControl(layerSwitcher);

    /*
    const container = document.getElementById('popup');
    const content = document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');

    const overlay = new ol.Overlay({
        element: container,
        autoPan: {
          animation: {
            duration: 250,
          },
        },
      });

    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
      };


    map.on('singleclick', function (evt) {
        const coordinate = evt.coordinate;
        //const hdms = ol.coordinate.toStringHDMS(toLonLat(coordinate));
      
        content.innerHTML = '<p>You clicked here:</p><code>' + "yes" + '</code>';
        overlay.setPosition(coordinate);
      });
    */
    

    const closer = document.getElementById('close-feature');
    
    const popupContainerElement = document.querySelector(' .overlay-container')
    const overlayLayer = new ol.Overlay({
        element: popupContainerElement,
        //positioning: 'center-left'
    });
    map.addOverlay(overlayLayer);

    //doesn't work for now
    function closePopup() {
        let popupContainer = document.querySelector(' .overlay-container')
        //popupContainer.style.display = "none";
        popupContainer.innerHTML = null;
      }
    
    closer.onclick = function () {
    overlayLayer.setPosition(undefined);
    closer.blur();
    return false;
    };
    

    //get HTML elements by ID in order to enable their interactivity
    const overlayFeatureName = document.getElementById('feature-name')
    const overlayFeaturePopEst = document.getElementById('feature-pop-est')
    const overlayFeatureSqkm = document.getElementById('feature-sq-km')
    //const popupContainerDisplay = document.getElementById('close-feature')
    /* on click event listener - enables the interactivity between the 
    mapped layer and its features with the rest of the code*/
    
    map.on('click', function(e){
        map.forEachFeatureAtPixel(e.pixel, function(feature, layer){
            //console.log(feature.get('title'))
            layerName = layer.get('title')
            //fetch the countries attributes
            if(layerName === 'World Countries'){
                let clickedFeatureName = feature.get('NAME');
                let clickedFeaturePopEst = feature.get('POP_EST');
                let clickedFeatureSqkm = feature.get('Sq_km');
                
                //sets new popup on click
                const clickedCoordinate = e.coordinate;
                overlayLayer.setPosition(clickedCoordinate); 

                //populate the HTML elements with feature attributes
                if (clickedFeatureName != undefined){
                    overlayFeatureName.innerHTML = "Country: " + clickedFeatureName
                    overlayFeaturePopEst.innerHTML = "Pop est.: " + clickedFeaturePopEst
                    overlayFeatureSqkm.innerHTML = "Sq. km: " + clickedFeatureSqkm
                }
            }else if (layerName === 'World Capital Cities'){
                let clickedFeatureName = feature.get('name');
                let clickedFeaturePopEst = feature.get('pop_max');
                
                
                //sets new popup on click
                const clickedCoordinate = e.coordinate;
                overlayLayer.setPosition(clickedCoordinate); 

                //populate the HTML elements with feature attributes
                if (clickedFeatureName != undefined){
                    overlayFeatureName.innerHTML = "City: " + clickedFeatureName
                    overlayFeaturePopEst.innerHTML = "Pop est.: " + clickedFeaturePopEst
                    overlayFeatureSqkm.innerHTML = ""
                }
            }
            
            
        })
    });
    
    
    // VECTOR FEATURE SECTION (geoJSON, styling..)


    
    //World countries style

    const fillStyleCountries = new ol.style.Fill({

      color: [84, 118, 255, 1] //4th digit - 1 nontransparent, 0 transparent
    });



    const strokeStyleCountries = new ol.style.Stroke({
        color: [46, 45, 45, 1],
        width: 1.2
    });
    
    const circleStyleCountries = new ol.style.Circle({
        fill: new ol.style.Fill({
            color: [245, 49, 5, 1]
        }),
        radius: 7,
        stroke: strokeStyleCountries
    });



    //World countries geoJSON as VectorImage
    const WorldCountriesGeoJSON = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: './Data/geoJSON/countries_modified_WGS_1984.json',
            format: new ol.format.GeoJSON(),
            
        }),
        visible: true,
        title: 'World Countries',
        style: new ol.style.Style({
            fill: fillStyleCountries,
            stroke: strokeStyleCountries,
            image: circleStyleCountries
        })
    });
    //map.addLayer(WorldCountriesGeoJSON)


    //World capitals style
    const fillStyleCapitals = new ol.style.Fill({
        color: [84, 118, 255, 0] //4th digit - 1 nontransparent, 0 transparent
    });
    
    const strokeStyleCapitals = new ol.style.Stroke({
        color: [46, 45, 45, 1],
        width: 2
    });
    
    const circleStyleCapitals = new ol.style.Circle({
        fill: new ol.style.Fill({
            color: [245, 49, 5, 1]
        }),
        radius: 4.5,
        stroke: strokeStyleCapitals
    });

    //World capitals geoJSON as VectorImage
    const WorldCapitalsGeoJSON = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: './Data/geoJSON/capital_cities.geojson',
            format: new ol.format.GeoJSON(),
            
        }),
        visible: true,
        title: 'World Capital Cities',
        style: new ol.style.Style({
            fill: fillStyleCapitals,
            stroke: strokeStyleCapitals,
            image: circleStyleCapitals
        })
    });
    //map.addLayer(WorldCapitalsGeoJSON)


    var vectorLayerGroup = new ol.layer.Group({
        layers: [WorldCountriesGeoJSON]
    })
    map.addLayer(vectorLayerGroup);


    const vectorLayerElements = document.querySelectorAll('.sidebar2 > input[type=radio]')
    for(let vectorLayerElement of vectorLayerElements){
        vectorLayerElement.addEventListener('change', function(){
            let vectorLayerValue = this.value;
            vectorLayerGroup.getLayers().forEach(function(element, index, array){
                let vectorlayerName = element.get('title');
                element.setVisible(vectorlayerName === vectorLayerValue)
            })
        })
    }


    const searchSource = new ol.source.Vector({
        features: []
      });

    WorldCapitalsGeoJSON.on("addfeature", function (e) {
        e.feature.set("featureType", "capital");
        searchSource.addFeature(e.feature);
      });
      
      WorldCountriesGeoJSON.on("addfeature", function (e) {
        e.feature.set("featureType", "country");
        searchSource.addFeature(e.feature);
      });
    
    /*
      var search = new ol.control.SearchFeature({
        source: WorldCapitalsGeoJSON, // of type ol.source.Vector
        getTitle: function (feature) {
            
            returnName = feature.get('name');

            return returnName
            
    }});
    map.addControl(search)
    */
      /*
      map.addControl(new ol.control.SearchFeature({
        source: searchSource,
        getTitle: function (feature) {
          switch (feature.get("featureType")) {
            case "capital":
              return feature.get("name");
            case "country":
              return feature.get("NAME");
          }
        },
      }));
    */
      

      var capitals = new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(capitalsObject)
    })

    var capitalsLayer = new ol.layer.Vector({
        title: 'Capitals',
        source: capitalsObject,
        style: new ol.style.Style({
            fill: fillStyleCapitals,
            stroke: strokeStyleCapitals,
            image: circleStyleCapitals
        })
    });



    var select = new ol.interaction.Select({});
    map.addInteraction(select);
    
    var search = new ol.control.SearchFeature({
        source: capitalsObject, //WorldCapitalsGeoJSON.getSource()
        property: $(".options select").val()
    });
      
    map.addControl(search)
    
    search.on('select'), function(e){
        select.getFeatures().clear;
        select.getFeatures().push (e.search);
        var p = e.search.getGeometry().getFirstCoordinate();
        map.getView().animate({center:p})
    }
    




    //Feature interaction (Select)
    
    const featureSelector = new ol.interaction.Select({
        condition: ol.events.condition.singleClick, //pointerMove for interactive 
         //TODO - Layer filter, for later on
        /*
        layers: function(layer){
            return layer.get('title') === 'World capital cities'
        },*/
        /*
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: [200, 100, 120, 1]
            })
        })*/

    })
map.addInteraction(featureSelector)












/*
    //Feature interaction (Pointermove/hover)
    const selectStyle = new ol.style.Style({
        fill: new ol.style.Fill({
        color: '#eeeeee',
        }),
        stroke: new ol.style.Stroke({
        color: 'rgba(255, 255, 255, 0.7)',
        width: 2,
        }),
    });


    let selected = null;
    map.on('pointermove', function (e) {
    if (selected !== null) {
        selected.setStyle(undefined);
        selected = null;
    }

    map.forEachFeatureAtPixel(e.pixel, function (f) {
        selected = f;
        selectStyle.getFill().setColor(f.get('COLOR') || '#eeeeee');
        f.setStyle(selectStyle);
        return true;
    });

    if (selected) {
        status.innerHTML = selected.get('ECO_NAME');
    } else {
        status.innerHTML = '&nbsp;';
    }
    });


*/


}// init() function
