import http from "../http-common";

class AuctionService {
  getAll() {
    return http.get("/auctions");
  }

  get(id) {
    return http.get(`/auctions/${id}`);
  }

  add(auction) {
    return http.post("/auctions", auction);
  }

  getByOwner(owner) {
    return http.get(`/auctions/owner/${owner}`);
  }

  getOffersByAuctionId(idOffer) {
    return http.get(`/auctionoffers/byOffer/${idOffer}`);
  }

  getOffersByUser(username) {
    return http.get(`/auctionoffers/byUser/${username}`);
  }

  addOffer(offer) {
    return http.post("/auctionoffers", offer);
  }

  getNotBuyNowAndId(id) {
    return http.get(`/auctions/notbuy/${id}`);
  }

  updateAuction(id, auction) {
    return http.put(`/auctions/${id}`, auction);
  }

  findTopOffer(id) {
    return http.get(`/auctionoffers/byOffer/top/${id}`);
  }

  getPage(page) {
    return http.get(`/auctions/page/${page}`);
  }
}

export default new AuctionService();