
const getters = {
  getChosePos: state => {
    const { lat, lng, city, address, title } = state.userPos
    return {
      lat,
      lng,
      title,
      city,
      address
    }
  },
}

export default getters
