google.maps.event.addDomListener(window, 'load', initialise);

var map;

var addressMarkers = [];

function initialise() {
    var mapOptions = {
        zoom: 10,
        center: { lat: -41.251906, lng: 174.792205}
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (pos) {
            console.log(pos.coords);
            var myLocationAccuracy = new google.maps.Circle({
                'map': map,
                'center': new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                'radius': pos.coords.accuracy,
                'fillColor': '#E95C42',
                'fillOpacity': 0.7,
                'strokeColor': '#FFFFFF', 
                'strokeOpacity': 0.7,
                'strokeWeight': 1
            })
            var myLocation = new google.maps.Marker({
                'map': map,
                'position': new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude)
            });
        });
    }
    loadAddresses();
}
function loadAddresses() {
    var request = new XMLHttpRequest();
    request.open('GET', 'js/customeraddress.json', true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);
            processAddresses(data);
        } else {
            // We reached our target server, but it returned an error

        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
    };

    request.send();
}

function processAddresses(addresses) {
    console.log(addresses);

    addresses.sort(function (addressA, addressB) {
        return addressB.lat - addressA.lat;
    });

    for (var i = 0; i < addresses.length; i += 1) {
        addAddressMarkers(addresses[i]);
    }

    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < addressMarkers.length; i += 1) {
        bounds.extend(addressMarkers[i].getPosition());
    }
    map.fitBounds(bounds);
}

function addAddressMarkers(address) {
    var marker = new google.maps.Marker({
        'map': map,
        'position': new google.maps.LatLng(address.lat, address.lng),
        'title': address.name,
        'icon': 'img/Pin-Pink-icon.png'

    });

    addressMarkers.push(marker);

    var addressList = document.querySelector("#address-list");

    var listItem = document.createElement('li');
    listItem.innerHTML = "<a href='#'>" + address.name + "</a>";
    
    addressList.appendChild(listItem);

    listItem.addEventListener('click', function(evt) { 
        evt.preventDefault();
        selectMarker(marker, listItem);
    });

    google.maps.event.addDomListener(marker, 'click', function() {
        selectMarker(marker, listItem);

        var contentString = document.querySelector("#infowindow-content").innerHTML;
        contentString = contentString.replace(/\{\{imgurl\}\}/g, address.image);
        contentString = contentString.replace(/\{\{name\}\}/g, address.name);
        console.log(contentString);
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
    });
}

function selectMarker(marker, listItem) {
    deselectAllMarkers();
    listItem.className = "active";
    marker.setIcon('img/pin-blue.png');
    marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
    map.setZoom(12);
}

function deselectAllMarkers() {
    for (var i = 0; i < addressMarkers.length; i += 1) {
        addressMarkers[i].setIcon('img/Pin-Pink-icon.png');
        addressMarkers[i].setZIndex(null);
    }
    var listItems = document.querySelectorAll("#address-list li");
    for (var i = 0; i < listItems.length; i += 1) {
        listItems[i].className = "";
    }
}



var infowindow = new google.maps.InfoWindow({});
    






