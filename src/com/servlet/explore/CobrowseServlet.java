package com.servlet.explore;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.impl.SimpleLoggerFactory;

import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;

//@WebServlet("/HashMapServlet")
public class CobrowseServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	final Logger logger = new SimpleLoggerFactory().getLogger("customLogger");
    public static HashMap<String,queObj> que=new HashMap<String,queObj>();
    public CobrowseServlet(){
        super();      
    }

    //Create array of data and write in response
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	try{
//    	logger.info(">> doGet()");
    	String id=request.getParameter("id");
        String user=request.getParameter("user");
    	response=crossDomain(response);
    	PrintWriter pw = response.getWriter() ;
     	int flag=0;
    	String data="{\"jsonArray\":[";
    	
    	if(user.equals("receiver")){
    		while(que.get(id) != null && que.get(id).listSen.size() > 0){
    			flag=1;
    			if(que.get(id).listSen.size()>1)
    				data += que.get(id).listSen.poll()+",";
    			else if(que.get(id).listSen.size()==1)
    				data += que.get(id).listSen.poll();
       	   }
    	}
    	
    	else if(user.equals("sender")){
    		while(que.get(id) != null && que.get(id).listRec.size() > 0){
    			flag=1;
    			if(que.get(id).listRec.size()>1)
    				data += que.get(id).listRec.poll()+",";
    			else if(que.get(id).listRec.size()==1)
    				data += que.get(id).listRec.poll();
       	   }
    	}
      
    	data+="]}";
      	if(flag==1){
      		pw.write(data);
//      		System.out.println(data);
      	}
      	else
      		response.setStatus(204);
//      	logger.info("<< doGet()");
      	
    	}
    	catch(Exception e){
    		logger.error(e.getMessage());
    	}
    	
	}

    //Put data in hashmap
     protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//    	 logger.info(">> doPost()");
    	 try{
    	 queObj obj;
    	 String jsonData = request.getParameter("jsonData");
		 String id = request.getParameter("id");
		 String user=request.getParameter("user");
		 response=crossDomain(response);
		 
//        System.out.println(user.equals("sender"));
		 if(user.equals("sender")){
		   if(que.containsKey(id)){
			   		obj=que.get(id);
			   		obj.listSen.add(jsonData);
//					System.out.println(obj.listSen.size());
			   		que.put(id,obj);
		   		  }
		 }
		 else if(user.equals("receiver")){
		   if(que.containsKey(id)){
				    obj=que.get(id);
					obj.listRec.add(jsonData);
//					System.out.println(obj.listSen.size());
					que.put(id,obj);
				  } 
		 }
//		logger.info("<< doPost()");
     }
    catch(Exception e){
    	logger.error(e.getMessage());
     }	
	}
     
	 public HttpServletResponse crossDomain(HttpServletResponse response) throws ServletException, IOException{
	 	response.setContentType("text/html; charset=utf-8");
	  	response.setHeader("Access-Control-Allow-Origin", "*");
	  	response.setHeader("Access-Control-Allow-Credentials","true");
	  	return response;
	 }
}

class queObj{
	ConcurrentLinkedQueue<String> listSen = new ConcurrentLinkedQueue<String>();
	ConcurrentLinkedQueue<String> listRec= new ConcurrentLinkedQueue<String>();
}

