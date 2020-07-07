static String apikey = "your serverside api key";

public static String getHubMatches(String hubID) throws Exception {
  return getJSONfromFaceit("https://open.faceit.com/data/v4/hubs/"+hubID+"/matches?type=ongoing&offset=0&limit=100", apikey);
 }
public static String getMatchInfo(String matchID) throws Exception {
  return getJSONfromFaceit("https://open.faceit.com/data/v4/matches/" + matchID, apikey);
 }
public static String getJSONfromFaceit(String urlToLoad, String faceitApiKey) throws Exception {
      StringBuilder result = new StringBuilder();
      URL url = new URL(urlToLoad);
      HttpURLConnection conn = (HttpURLConnection) url.openConnection();
      conn.setRequestMethod("GET");
      conn.setRequestProperty("Authorization", "Bearer "+faceitApiKey);
      BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));
      String line;
      while ((line = rd.readLine()) != null) {
         result.append(line);
      }
      rd.close();
      return result.toString();
 }
