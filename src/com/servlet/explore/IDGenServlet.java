package com.servlet.explore;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.impl.SimpleLoggerFactory;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

//@WebServlet("/IDGenServlet")
public class IDGenServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	final Logger logger = new SimpleLoggerFactory().getLogger("customLogger");
    int[] arr = new int[50];
	static int i=0;
    public IDGenServlet() {
        super();      
    }
    
    //Generate random id and write in response
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try{
		logger.info("IDGenServlet>> doGet()");
		response=crossDomain(response);
		if(request.getParameter("id")!=null){
			String delId=request.getParameter("id");
			System.out.println("id="+delId);
			int id=Integer.parseInt(delId);
			CobrowseServlet.que.remove(delId);
			System.out.println("key="+CobrowseServlet.que.containsKey(delId));
			
			for(int j=0;j<i;j++){
				if(arr[j]==id){
					arr[j]=-1;
					logger.info("Session ended by Sender");
				}
			}
		}
		else{
		Random randomGenerator = new Random();
	      int id = randomGenerator.nextInt(100);
	      for(int j=0;j<i;j++){
				if(arr[j]==id){
					logger.warn(id+"already present");
					id=randomGenerator.nextInt(100);
					j=0;
				}
	      }
	      
	      arr[i]=id;
	      i=i+1;
	      String resp = String.valueOf(id);
	      
	      CobrowseServlet.que.put(resp,new queObj());   
	      PrintWriter pw = response.getWriter();
	      pw.write(resp);
		}
	      logger.info("IDGenServlet<< doGet()");
		}
		catch(Exception e){
			logger.error(e.getMessage());
			
		}
	}
	//Authenticate id sent by Receiver
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try{
		 logger.info("IDGenServlet>> doPost()");
		 response=crossDomain(response);
		 String str=request.getParameter("id");
		 int id=Integer.parseInt(str);
		 for(int j=0;j<i;j++)
		 	{
			 if(arr[j]==id){
				 PrintWriter pw = response.getWriter();
				 String resp="ok";
				 pw.write(resp);
			 }
			 else
				 logger.warn("Invalid Id");
		 }
		 logger.info("IDGenServlet<< doPost()");
	}
	catch(Exception e){
		logger.error(e.getMessage());
	}	
	}
	 public HttpServletResponse crossDomain(HttpServletResponse response) throws ServletException, IOException
	 {
	 	response.setContentType("text/html; charset=utf-8");
	  	response.setHeader("Access-Control-Allow-Origin", "*");
	  	response.setHeader("Access-Control-Allow-Credentials","true");
	  	return response;
	 }	
}
