FROM php:7.4-apache
RUN pecl install xdebug && docker-php-ext-enable xdebug
RUN a2enmod rewrite

RUN usermod -u 1000 www-data
RUN usermod -G staff www-data
RUN chown -R www-data:www-data .
RUN chmod -R g+rw .