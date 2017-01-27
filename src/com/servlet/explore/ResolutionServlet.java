package com.servlet.explore;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.impl.SimpleLoggerFactory;

//import ch.qos.logback.classic.LoggerContext;
//import ch.qos.logback.core.util.StatusPrinter;
import java.io.PrintWriter;
import java.util.HashMap;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


//@WebServlet("/ResolutionServlet")
public class ResolutionServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	final Logger logger = new SimpleLoggerFactory().getLogger("customLogger");
    
	ResFactor fact;
	static HashMap<String,ResFactor> list=new HashMap<String,ResFactor>(); 

    public ResolutionServlet() {
        super();
        
    }
	
	//Get Resolution from Receiver and calculate Resolution factor
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    	try{
    	logger.info("ResolutionServlet>> doGet()");
    	String value=null;
    	PrintWriter pw = response.getWriter() ;
		response=crossDomain(response);
		String id=request.getParameter("id");
		
		if(request.getParameter("width") != null){
			String width=request.getParameter("width");
			String height=request.getParameter("height");
		
			logger.info(id+ " R "+ width+","+height);
		
			fact.recH=Integer.parseInt(height);
			fact.recW=Integer.parseInt(width);
			fact.calFactor();
			list.put(id,fact);
			logger.info("FACTOR="+fact.facX+","+fact.facY);
//			System.out.println(list.get(id).facX);
		  	
		}	
	    if(list.containsKey(id))
		  value=list.get(id).facX+","+list.get(id).facY;  
		pw.write(value);
		 
		logger.info("ResolutionServlet<< doGet()");
    	}
    	catch(Exception e){
		  logger.error(e.getMessage());
    	}
		
	}
    
    //Get Resolution sent by Sender
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		logger.info("ResolutionServlet>> doPost()");
		response=crossDomain(response);
		String id=request.getParameter("id");
	
	   	String width=request.getParameter("width");
			String height=request.getParameter("height");
			logger.info(id+ " S "+ width+","+height);
			list.put(id,new ResFactor());
			fact=list.get(id);
			fact.senH=Integer.parseInt(height);
			fact.senW=Integer.parseInt(width);
	    logger.info("ResolutionServlet<< doPost()");
	}
	
	public HttpServletResponse crossDomain(HttpServletResponse response) throws ServletException, IOException{
	 	response.setContentType("text/html; charset=utf-8");
	  	response.setHeader("Access-Control-Allow-Origin", "*");
	  	response.setHeader("Access-Control-Allow-Credentials","true");
	  	return response;
	 }
   
}

class ResFactor{
    int senH, senW;
    float recH,recW, facX, facY;
    public void calFactor()
    {
    	facX=(senW-recW)/2;
        facY=0;
    }
	
}
