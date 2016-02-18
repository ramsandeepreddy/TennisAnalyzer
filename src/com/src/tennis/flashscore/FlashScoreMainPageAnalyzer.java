package com.src.tennis.flashscore;

import java.util.logging.Level;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

public class FlashScoreMainPageAnalyzer {

	public static void main(String[] args) throws Exception {
		// TODO Auto-generated method stub
		homePage();

	}
	public static void homePage() throws Exception {
		java.util.logging.Logger.getLogger("com.gargoylesoftware").setLevel(java.util.logging.Level.OFF);
		java.util.logging.Logger.getLogger("com.gargoylesoftware.htmlunit").setLevel(java.util.logging.Level.OFF);
	    java.util.logging.Logger.getLogger("org.apache.http").setLevel(java.util.logging.Level.OFF);
        java.util.logging.Logger.getLogger("com.gargoylesoftware.htmlunit").setLevel(Level.OFF);
        java.util.logging.Logger.getLogger("org.apache.commons.httpclient").setLevel(Level.OFF);
       

		final WebClient webClient = new WebClient(BrowserVersion.INTERNET_EXPLORER_11);
		try {
			final HtmlPage page = webClient.getPage("http://www.flashscore.com/match/zBKiylSH/#match-summary");
			webClient.waitForBackgroundJavaScript(60000);
			System.out.println(page.asText());
			final String pageAsXml = page.asXml();
			final String pageAsText = page.asText();
		}
		catch(Exception e)
		{

		}
	}

	public static void singleMatch()
	{
		//http://www.flashscore.com/match/zBKiylSH/#match-summary

	}
}
