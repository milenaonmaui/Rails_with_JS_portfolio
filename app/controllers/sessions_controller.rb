class SessionsController < ApplicationController

    def new
        @user = User.new
        render :login
    end

    def create
        @user = User.find_by(:email => params[:user][:email])
        if @user && @user.authenticate(params[:user][:password])
            session[:user_id]=@user.id
            redirect_to user_path(@user)
        else
            flash[:error] = "Invalid email or password"
            redirect_to login_path
        end
    end

    def oauth_login
        @user = User.find_or_create_by_omniauth(auth)
        @user.save
        session[:user_id]=@user.id
        redirect_to cruises_path
    end

    def welcome
        @featured = Cruise.featured
    end

    def destroy
        session.clear
        redirect_to '/'
    end

    private

        def  auth 
            request.env['omniauth.auth']
        end
end