const display = async() => {

  let vaccineCenters = []

  //Fetch the data from the local server
  try {
    await fetch('http://localhost:8000')
      .then(response => response.json())
      .then(response => {
        console.log("Response of fetching vaccine centers: " , response)
        vaccineCenters = response.sessions || []
        })
  } catch (err) {
    console.log(err)
  }

  //If centres are not available then display message
  if (vaccineCenters.length === 0) {
    document.querySelector('.table').innerHTML = ""
    document.querySelector(".vaccine_unavailable").classList.remove('hidden')
  }

  //create HTML elements and append them to the parent
  const fields = ["center_id", "name", "address", "from", "to", "fee_type", "min_age_limit", "vaccine", "slots"]
  vaccineCenters.forEach(center => {
    let row = document.createElement('tr')

    for (item of fields) {

      let element = document.createElement('td')
      if (item === "slots") {
        element.innerText = center[item].join("\n")
        element.style.width = "15%"
      } else {
        element.innerText = center[item]
      }

      row.appendChild(element)
    }

    document.getElementById("table_body").appendChild(row)
  })

}

display()