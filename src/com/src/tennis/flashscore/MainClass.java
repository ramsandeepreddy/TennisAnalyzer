package com.src.tennis.flashscore;

import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;

public class MainClass {

	public static void main(String args[]) throws InterruptedException
	{
		
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
	}
}
