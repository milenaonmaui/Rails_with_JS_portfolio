class BookingsController < ApplicationController
    before_action :require_logged_in

    def new  
        if params[:cruise_id] && @cruise = Cruise.find_by_id(params[:cruise_id])
            @booking = @cruise.bookings.build
            @booking.user = current_user
        else
            flash[:error] = "Select a valid cruise"
            redirect_to cruises_path
        end
    end

    def create
       
        @booking = Booking.new(booking_params)
        @booking.user_id = current_user.id
        if @booking.save
           #flash[:success] = "Booking created!"
           #redirect_to booking_path(@booking)
           render json: @booking
        #else
        #   display_errors
        #   render :new
        end    
    end

    def show
        find_booking
        @cruise = @booking.cruise
        respond_to do |f|
            f.html 
            f.json {render json: @booking}
        end      
    end

    def index
        if admin?
            @cruise = Cruise.find_by_id(params[:cruise_id])
            @bookings = @cruise.bookings
        else
            redirect_to user_path(current_user)
        end
        respond_to do |f|
            f.html 
            f.json {render json: @bookings}
        end      
    end

    def edit
        find_booking
    end

    def update
        find_booking    
        if @booking.update(booking_params)
           flash[:success] = "Booking updated!"
           redirect_to booking_path(@booking)
        else
          display_errors
          render :edit
        end
    end

    def destroy
        find_booking
        @booking.destroy
        redirect_to user_path(current_user)
    end

    private

		def booking_params
			params.require(:booking).permit(:num_adults, :num_children, :user_id, :cruise_id)
        end
        
        def find_booking
            @booking = Booking.find_by_id(params[:id])
            if !@booking
                flash[:error] = "Invalid booking!"
                redirect_to user_path(current_user)
            end
        end

        def display_errors
            flash[:error] = "#{@booking.errors.messages.values.join(". ")}"
        end
end
