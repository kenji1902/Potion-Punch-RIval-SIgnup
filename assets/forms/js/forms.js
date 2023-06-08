let errorMsg = alertHtml("Connection Problem!","It seems that you are offline or the connection is slow")
let slowConnection = alertHtml("Ohh no!","It seems that your connection is slow, Please wait!")
const emailRegex = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/;
let images = [
  {src : "assets/forms/images/ppr_web_screenshot_gameplay.png"},
  {src : "assets/forms/images/ppr_web_screenshot_homescreen.png"},
  {src : "assets/forms/images/ppr_web_screenshot_keepers.png"},
  {src : "assets/forms/images/ppr_web_screenshot_result.png"},
  {src : "assets/forms/images/ppr_web_screenshot_vs.png"}
];

$(document).ready(function () {
//  fillYear(1923,2023)
  fillCountry()
  showMonthPlaceHolder();

  $("#submitMonstronauts").submit(function (e) { 
    e.preventDefault();
    $forms = $(this)
    let timeout = 10000; //10 seconds
    
    detachSubmitButtonEvent();
    checkDeviceOnline(timeout)
      .done((value) => {
        let data = loadData($forms);
        //console.log(data)
        ajaxSendForm(data);
      })
      .fail((error) => {
          attachSubmitButtonEvent();
          customAlert(errorMsg);
      })
  });

  attachSubmitButtonEvent();
  inputValidity("#email","Please enter a valid email");
  checkboxValidity("#checkbox","Please accept the terms to proceed")
  setUpCarousel("#monstronauts-carousel");
 
});

function setUpCarousel(id, carouselItem = ".carousel-item", onClick = ".card-img"){
  $(id).carousel();
  let items = $(`${id} ${carouselItem}`);
  items.each(function() {
      let minPerSlide = 4;
      let next = $(this).next();

      for (let i = 1; i < minPerSlide; i++) {
          if (!next.length) {
              // wrap carousel by using first child
              next = items.first();
          }

          let cloneChild = next.clone(true);
          $(this).append(cloneChild.children().eq(0));
          next = next.next();
      }
  });
  
  $(onClick).click(function(e){
    var index = $(this).attr("index");
    let temp = moveElementToFront(images,index);
    Fancybox.show(temp)
  })
}
function moveElementToFront(array, index) {
  if (index >= 0 && index < array.length) {
    var newArray = [...array];
    var element = newArray.splice(index, 1)[0];
    newArray.unshift(element);
    return newArray;
  }
  return array; 
}
function loadData($forms){
  let serializedData  = $forms.serializeArray();
  let data = serializedData.reduce(function(obj, item) {
    obj[item.name] = item.value;
    return obj;
  }, {});
  return data
}
function ajaxSendForm(data){
  let countryData = data.country.split("_");
    $.ajax({
      type: "POST",
      url: "https://sendy-staging.monstronauts.com/subscribe",
      contentType: "application/x-www-form-urlencoded",
      dataType: 'json',
      data: {
        api_key: "8bQQyZdQC8J7O2qad8lz",
        list: data.list,
        referrer: "https://potionpunchrivals.com/",
        gdpr: true,
        hp: "",
        boolean: "true",
        country: countryData[0],//Code [PH]
        name: data.name,
        email: data.email,
        Birth: data.birth,
        CountryName: countryData[1],//Value [Philippines]
        Platform: data.platform
      },
      success: function (response) {
        window.location.href = "registered";
      },
      error: function (xhr, status, error) {
        window.location.href = "registered";
      }
    });
}
function checkNetworkStatus() {
  let deferred = $.Deferred();
  $.ajax({
    url: "https://potionpunchrivals.com/registered", // Replace with the path to your static file
    type: "GET",
    timeout: 5000, // Timeout duration in milliseconds,
    success: function () {
      deferred.resolve();
    },
    error: function(xhr, textStatus, errorThrown) {
      deferred.reject();
    }
  })
  return deferred.promise();
}
function checkDeviceOnline(timeout) {
  let deferred = $.Deferred();
  checkNetworkStatus()
    .done(() => {
      deferred.resolve();
    })
    .fail(() => {
      customAlert(slowConnection,10000);
      setTimeout(() => {

        checkNetworkStatus()
          .done(() => {
            deferred.resolve();
          })
          .fail(() =>{
            deferred.reject("Check Internet Connection");
          })
        
      }, timeout);
    });

  return deferred.promise();
}
function detachSubmitButtonEvent(){
  let btn = $("#submitBtn");
  btn.removeClass("hover-highlight");
  btn.addClass("grayscale-element");
  $("#submit"). attr("disabled", true);
  btn.off();
}
function attachSubmitButtonEvent(){
  let btn = $("#submitBtn");
  btn.addClass("hover-highlight");
  btn.removeClass("grayscale-element");
  $("#submit"). attr("disabled", false);
  btn.click(function (e) { 
    //e.preventDefault();
    $("#submit").click();
  });
}
function inputValidity(element, onMismatch, onEmpty = "") {
  $(element).on("input", function() {
    const inputElement = this;

    if (inputElement.type === 'email' && !validateEmail(inputElement.value)) {
      inputElement.setCustomValidity(onMismatch);
    } else if (inputElement.validity.typeMismatch) {
      inputElement.setCustomValidity(onMismatch);
    } else {
      inputElement.setCustomValidity(onEmpty);
    }
  });
}
function checkboxValidity(element, onMismatch, onEmpty = "") {
  let checkbox = $(element);
  checkbox.change(function() {
    if (!$(this).is(':checked')) {
      this.setCustomValidity(onMismatch);
    } else {
      this.setCustomValidity(onEmpty);
    }
  });
  
  $(window).on("pageshow", function() {
    checkbox.change();
  });
}
function validateEmail(email) {
  return emailRegex.test(email);
}
function showMonthPlaceHolder(){
  let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgentData);
  let placeholderValue = "MMMM YYYY";
  let $input = $('#month');
  let $placeholder = $(".placeholder");

  $input.focus(function (e) { 
    if(!isMobile){
      $(this).removeClass("hideMonthPlaceholder");
      $placeholder.html("")
    } 
  });
  $input.blur(function (e) { 
    if(!isMobile && !$(this).val()){
      $(this).addClass("hideMonthPlaceholder");
      $placeholder.html(placeholderValue)
    } 
  });

  $placeholder.html(placeholderValue)
  
  $input.on("input", function(){
      if($(this).val()){
          // if(!isMobile){
          //   $placeholder.html($(this).val())
          //   $placeholder.css("color","black")
          // }
          // else
            $placeholder.html("")
      }
      if(!$(this).val() && isMobile){
          $placeholder.html(placeholderValue)  
          $placeholder.css("color","gray")
        
      }
    })

}
function setMonthPlaceholder(){
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  
  var $input = $('#month');
  $input.attr('type', 'text').val('MM/YYYY');

  
  $input.on('focus', function() {   
      $.when($(this).attr('type', 'month').val('').promise())
      .then( () => {
          if(!isMobile){
            setTimeout( () => {
              $(this).get(0).showPicker()
            },100)
            // console.log("!isMobile")
          }
          else{
            setTimeout( () => {
              $(this).get(0).focus();
              $(this).get(0).click();
            },100)
            // console.log("isMobile")

          }
        }
        
      )
     
      
    });
    
    $input.on('blur', function() {
      if (!$(this).val() || $(this).val() === 'MM/YYYY') {
        $(this).attr('type', 'month').val('');
      }
      if (!$(this).val()) {
        $(this).attr('type', 'text').val('MM/YYYY');
      }
    });
  
}
function alertHtml(title,message){
  return `
  <div class="alert-fixed alert alert-warning alert-dismissible fade show" role="alert">
    <strong>${title}</strong> ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
  `
}
function customAlert(html,timeout=5000){
  $('body').append(html);
  setTimeout(function() {
    $('.alert').alert('close');
  }, timeout);
}
async function fillYear(from,to){
  for(let i = to; i >= from; i--){
    await $("#Year").append(`<option value="${i}">${i}</option>`);
  }
}
async function fillCountry(){
  countries.forEach(async element => {
    await $("#Countries").append(`<option value="${element.code}_${element.name}">${element.name}</option>`);
  });
}
function slideUpforms(){
  $("#forms-container").addClass("slide-out-top");
  $("#forms-container").addClass("hidden");
}
const countries = [
  {name: "Afghanistan",code: "AF"},
  {name: "Åland Islands",code: "AX"},
  {name: "Albania",code: "AL"},
  {name: "Algeria",code: "DZ"},
  {name: "American Samoa",code: "AS"},
  {name: "Andorra",code: "AD"},
  {name: "Angola",code: "AO"},
  {name: "Anguilla",code: "AI"},
  {name: "Antarctica",code: "AQ"},
  {name: "Antigua & Barbuda",code: "AG"},
  {name: "Argentina",code: "AR"},
  {name: "Armenia",code: "AM"},
  {name: "Aruba",code: "AW"},
  {name: "Australia",code: "AU"},
  {name: "Austria",code: "AT"},
  {name: "Azerbaijan",code: "AZ"},
  {name: "Bahamas",code: "BS"},
  {name: "Bahrain",code: "BH"},
  {name: "Bangladesh",code: "BD"},
  {name: "Barbados",code: "BB"},
  {name: "Belarus",code: "BY"},
  {name: "Belgium",code: "BE"},
  {name: "Belize",code: "BZ"},
  {name: "Benin",code: "BJ"},
  {name: "Bermuda",code: "BM"},
  {name: "Bhutan",code: "BT"},
  {name: "Bolivia",code: "BO"},
  {name: "Caribbean Netherlands",code: "BQ"},
  {name: "Bosnia & Herzegovina",code: "BA"},
  {name: "Botswana",code: "BW"},
  {name: "Bouvet Island",code: "BV"},
  {name: "Brazil",code: "BR"},
  {name: "British Indian Ocean Territory",code: "IO"},
  {name: "Brunei",code: "BN"},
  {name: "Bulgaria",code: "BG"},
  {name: "Burkina Faso",code: "BF"},
  {name: "Burundi",code: "BI"},
  {name: "Cambodia",code: "KH"},
  {name: "Cameroon",code: "CM"},
  {name: "Canada",code: "CA"},
  {name: "Cape Verde",code: "CV"},
  {name: "Cayman Islands",code: "KY"},
  {name: "Central African Republic",code: "CF"},
  {name: "Chad",code: "TD"},
  {name: "Chile",code: "CL"},
  {name: "China",code: "CN"},
  {name: "Christmas Island",code: "CX"},
  {name: "Cocos (Keeling) Islands",code: "CC"},
  {name: "Colombia",code: "CO"},
  {name: "Comoros",code: "KM"},
  {name: "Congo - Brazzaville",code: "CG"},
  {name: "Congo - Kinshasa",code: "CD"},
  {name: "Cook Islands",code: "CK"},
  {name: "Costa Rica",code: "CR"},
  {name: "Côte d’Ivoire",code: "CI"},
  {name: "Croatia",code: "HR"},
  {name: "Cuba",code: "CU"},
  {name: "Curaçao",code: "CW"},
  {name: "Cyprus",code: "CY"},
  {name: "Czechia",code: "CZ"},
  {name: "Denmark",code: "DK"},
  {name: "Djibouti",code: "DJ"},
  {name: "Dominica",code: "DM"},
  {name: "Dominican Republic",code: "DO"},
  {name: "Ecuador",code: "EC"},
  {name: "Egypt",code: "EG"},
  {name: "El Salvador",code: "SV"},
  {name: "Equatorial Guinea",code: "GQ"},
  {name: "Eritrea",code: "ER"},
  {name: "Estonia",code: "EE"},
  {name: "Ethiopia",code: "ET"},
  {name: "Falkland Islands (Islas Malvinas)",code: "FK"},
  {name: "Faroe Islands",code: "FO"},
  {name: "Fiji",code: "FJ"},
  {name: "Finland",code: "FI"},
  {name: "France",code: "FR"},
  {name: "French Guiana",code: "GF"},
  {name: "French Polynesia",code: "PF"},
  {name: "French Southern Territories",code: "TF"},
  {name: "Gabon",code: "GA"},
  {name: "Gambia",code: "GM"},
  {name: "Georgia",code: "GE"},
  {name: "Germany",code: "DE"},
  {name: "Ghana",code: "GH"},
  {name: "Gibraltar",code: "GI"},
  {name: "Greece",code: "GR"},
  {name: "Greenland",code: "GL"},
  {name: "Grenada",code: "GD"},
  {name: "Guadeloupe",code: "GP"},
  {name: "Guam",code: "GU"},
  {name: "Guatemala",code: "GT"},
  {name: "Guernsey",code: "GG"},
  {name: "Guinea",code: "GN"},
  {name: "Guinea-Bissau",code: "GW"},
  {name: "Guyana",code: "GY"},
  {name: "Haiti",code: "HT"},
  {name: "Heard & McDonald Islands",code: "HM"},
  {name: "Vatican City",code: "VA"},
  {name: "Honduras",code: "HN"},
  {name: "Hong Kong",code: "HK"},
  {name: "Hungary",code: "HU"},
  {name: "Iceland",code: "IS"},
  {name: "India",code: "IN"},
  {name: "Indonesia",code: "ID"},
  {name: "Iran",code: "IR"},
  {name: "Iraq",code: "IQ"},
  {name: "Ireland",code: "IE"},
  {name: "Isle of Man",code: "IM"},
  {name: "Israel",code: "IL"},
  {name: "Italy",code: "IT"},
  {name: "Jamaica",code: "JM"},
  {name: "Japan",code: "JP"},
  {name: "Jersey",code: "JE"},
  {name: "Jordan",code: "JO"},
  {name: "Kazakhstan",code: "KZ"},
  {name: "Kenya",code: "KE"},
  {name: "Kiribati",code: "KI"},
  {name: "North Korea",code: "KP"},
  {name: "South Korea",code: "KR"},
  {name: "Kosovo",code: "XK"},
  {name: "Kuwait",code: "KW"},
  {name: "Kyrgyzstan",code: "KG"},
  {name: "Laos",code: "LA"},
  {name: "Latvia",code: "LV"},
  {name: "Lebanon",code: "LB"},
  {name: "Lesotho",code: "LS"},
  {name: "Liberia",code: "LR"},
  {name: "Libya",code: "LY"},
  {name: "Liechtenstein",code: "LI"},
  {name: "Lithuania",code: "LT"},
  {name: "Luxembourg",code: "LU"},
  {name: "Macao",code: "MO"},
  {name: "North Macedonia",code: "MK"},
  {name: "Madagascar",code: "MG"},
  {name: "Malawi",code: "MW"},
  {name: "Malaysia",code: "MY"},
  {name: "Maldives",code: "MV"},
  {name: "Mali",code: "ML"},
  {name: "Malta",code: "MT"},
  {name: "Marshall Islands",code: "MH"},
  {name: "Martinique",code: "MQ"},
  {name: "Mauritania",code: "MR"},
  {name: "Mauritius",code: "MU"},
  {name: "Mayotte",code: "YT"},
  {name: "Mexico",code: "MX"},
  {name: "Micronesia",code: "FM"},
  {name: "Moldova",code: "MD"},
  {name: "Monaco",code: "MC"},
  {name: "Mongolia",code: "MN"},
  {name: "Montenegro",code: "ME"},
  {name: "Montserrat",code: "MS"},
  {name: "Morocco",code: "MA"},
  {name: "Mozambique",code: "MZ"},
  {name: "Myanmar (Burma)",code: "MM"},
  {name: "Namibia",code: "NA"},
  {name: "Nauru",code: "NR"},
  {name: "Nepal",code: "NP"},
  {name: "Netherlands",code: "NL"},
  {name: "Curaçao",code: "AN"},
  {name: "New Caledonia",code: "NC"},
  {name: "New Zealand",code: "NZ"},
  {name: "Nicaragua",code: "NI"},
  {name: "Niger",code: "NE"},
  {name: "Nigeria",code: "NG"},
  {name: "Niue",code: "NU"},
  {name: "Norfolk Island",code: "NF"},
  {name: "Northern Mariana Islands",code: "MP"},
  {name: "Norway",code: "NO"},
  {name: "Oman",code: "OM"},
  {name: "Pakistan",code: "PK"},
  {name: "Palau",code: "PW"},
  {name: "Palestine",code: "PS"},
  {name: "Panama",code: "PA"},
  {name: "Papua New Guinea",code: "PG"},
  {name: "Paraguay",code: "PY"},
  {name: "Peru",code: "PE"},
  {name: "Philippines",code: "PH"},
  {name: "Pitcairn Islands",code: "PN"},
  {name: "Poland",code: "PL"},
  {name: "Portugal",code: "PT"},
  {name: "Puerto Rico",code: "PR"},
  {name: "Qatar",code: "QA"},
  {name: "Réunion",code: "RE"},
  {name: "Romania",code: "RO"},
  {name: "Russia",code: "RU"},
  {name: "Rwanda",code: "RW"},
  {name: "St. Barthélemy",code: "BL"},
  {name: "St. Helena",code: "SH"},
  {name: "St. Kitts & Nevis",code: "KN"},
  {name: "St. Lucia",code: "LC"},
  {name: "St. Martin",code: "MF"},
  {name: "St. Pierre & Miquelon",code: "PM"},
  {name: "St. Vincent & Grenadines",code: "VC"},
  {name: "Samoa",code: "WS"},
  {name: "San Marino",code: "SM"},
  {name: "São Tomé & Príncipe",code: "ST"},
  {name: "Saudi Arabia",code: "SA"},
  {name: "Senegal",code: "SN"},
  {name: "Serbia",code: "RS"},
  {name: "Serbia",code: "CS"},
  {name: "Seychelles",code: "SC"},
  {name: "Sierra Leone",code: "SL"},
  {name: "Singapore",code: "SG"},
  {name: "Sint Maarten",code: "SX"},
  {name: "Slovakia",code: "SK"},
  {name: "Slovenia",code: "SI"},
  {name: "Solomon Islands",code: "SB"},
  {name: "Somalia",code: "SO"},
  {name: "South Africa",code: "ZA"},
  {name: "South Georgia & South Sandwich Islands",code: "GS"},
  {name: "South Sudan",code: "SS"},
  {name: "Spain",code: "ES"},
  {name: "Sri Lanka",code: "LK"},
  {name: "Sudan",code: "SD"},
  {name: "Suriname",code: "SR"},
  {name: "Svalbard & Jan Mayen",code: "SJ"},
  {name: "Eswatini",code: "SZ"},
  {name: "Sweden",code: "SE"},
  {name: "Switzerland",code: "CH"},
  {name: "Syria",code: "SY"},
  {name: "Taiwan",code: "TW"},
  {name: "Tajikistan",code: "TJ"},
  {name: "Tanzania",code: "TZ"},
  {name: "Thailand",code: "TH"},
  {name: "Timor-Leste",code: "TL"},
  {name: "Togo",code: "TG"},
  {name: "Tokelau",code: "TK"},
  {name: "Tonga",code: "TO"},
  {name: "Trinidad & Tobago",code: "TT"},
  {name: "Tunisia",code: "TN"},
  {name: "Turkey",code: "TR"},
  {name: "Turkmenistan",code: "TM"},
  {name: "Turks & Caicos Islands",code: "TC"},
  {name: "Tuvalu",code: "TV"},
  {name: "Uganda",code: "UG"},
  {name: "Ukraine",code: "UA"},
  {name: "United Arab Emirates",code: "AE"},
  {name: "United Kingdom",code: "GB"},
  {name: "United States",code: "US"},
  {name: "U.S. Outlying Islands",code: "UM"},
  {name: "Uruguay",code: "UY"},
  {name: "Uzbekistan",code: "UZ"},
  {name: "Vanuatu",code: "VU"},
  {name: "Venezuela",code: "VE"},
  {name: "Vietnam",code: "VN"},
  {name: "British Virgin Islands",code: "VG"},
  {name: "U.S. Virgin Islands",code: "VI"},
  {name: "Wallis & Futuna",code: "WF"},
  {name: "Western Sahara",code: "EH"},
  {name: "Yemen",code: "YE"},
  {name: "Zambia",code: "ZM"},
  {name: "Zimbabwe",code: "ZW"}
];
