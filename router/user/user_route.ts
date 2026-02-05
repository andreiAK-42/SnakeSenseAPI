class UserRoute {
  async Authorization(login: string, password: string): Promise<boolean> {
    if (!login || !password) {
      return false;
    }

    

    return true;
  }
}
