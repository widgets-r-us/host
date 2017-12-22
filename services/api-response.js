module.exports = {
  ApiResponse: function(status, message) {
      this.status = status
      this.message = message
  }
}