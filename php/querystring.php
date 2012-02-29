<?php

class QueryString
{
    protected $_vars = array();

    public function __construct($vars = array())
    {
        $this->_vars = $vars;
    }

    public static function factory($vars = array())
    {
        $output = $vars;

        if (!is_array($vars))
        {
            parse_str($vars, $output);
        }

        return new QueryString($output);
    }

    public function set($key, $value = NULL)
    {
        if (is_array($key))
        {
            foreach ($key as $name => $value)
            {
                $this->_vars[$name] = $value;
            }
        }
        else
        {
            $this->_vars[$key] = $value;
        }

        return $this;
    }

    public function get($key, $default = NULL)
    {
        return isset($this->_vars[$key]) ? $this->_vars[$key] : $default;
    }

    public function remove()
    {
        $args = func_get_args();
        foreach ($args as $arg)
        {
            unset($this->_vars[$arg]);
        }

        return $this;
    }

    public function query()
    {
        $query = http_build_query($this->_vars, '', '&');
        $query = str_replace(array('%5B','%5D'), array('[', ']'), $query);

        return $query;
    }

    public function getAll()
    {
        return $this->_vars;
    }

    /**
     * Magic method, returns the output of [QueryString::query].
     *
     * @return  string
     * @uses    QueryString::query
     */
    public function __toString()
    {
        return $this->query();
    }
}