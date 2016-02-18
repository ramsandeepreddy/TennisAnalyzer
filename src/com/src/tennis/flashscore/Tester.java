package com.src.tennis.flashscore;


import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import com.thoughtworks.selenium.Selenium;
import com.thoughtworks.selenium.webdriven.WebDriverBackedSelenium;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;

import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;
import static org.apache.commons.lang3.StringUtils.join;

public class Tester {
	private Selenium selenium;

	public static void main() throws InterruptedException{
		/*WebDriver driver = new FirefoxDriver();
		String baseUrl = "http://www.flashscore.in/";
		selenium = new WebDriverBackedSelenium(driver, baseUrl);*/
		WebDriver driver = new FirefoxDriver();
		 
		driver.manage().window().maximize();		 
		driver.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
		String baseUrl = "http://www.flashscore.com/tennis/";
		driver.get(baseUrl);
		JavascriptExecutor jse = (JavascriptExecutor)driver;
		jse.executeScript("window.scrollBy(0,1400)", "");
		Thread.sleep(3000);
		WebElement element = driver.findElement(By.id("fs"));
		System.out.println(element.getText());
		/*Actions action = new Actions(driver);
		action.moveToElement(element).build().perform();*/
		 
	}

	/*@Test
	public void testTester() throws Exception {
	}

	@After
	public void tearDown() throws Exception {
		selenium.stop();
	}*/
}