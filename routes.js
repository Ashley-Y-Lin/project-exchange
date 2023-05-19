"use strict";

/** Routes for Project Exchange */

const express = require("express");
const { BadRequestError } = require("./expressError");
const router = new express.Router();


/** GET / : show About page. */

router.get("/", async function (req, res, next) {
  const customers = await Customer.searchCustomers(req.query.search);
  return res.render("customer_list.html", { customers });
});


/** GET /team: show Team page. */

router.get("/team", async function (req, res, next) {
  const customers = await Customer.getTopTenByMostReservations();

  return res.render("customer_top.html", { customers });
});


/** GET /work: show Work page. */

router.get("/work", async function (req, res, next) {
  return res.render("customer_new_form.html");
});


/** GET /contact: show Contact page. */

router.get("/contact", async function (req, res, next) {
  if (req.body === undefined) {
    throw new BadRequestError();
  }
  const { firstName, lastName, phone, notes } = req.body;
  const customer = new Customer({ firstName, lastName, phone, notes });
  await customer.save();

  return res.redirect(`/${customer.id}/`);
});

/** POST /contact: handle submision to Contact form. */

router.post("/contact", async function (req, res, next) {
  const customer = await Customer.get(req.params.id);

  const reservations = await customer.getReservations();

  return res.render("customer_detail.html", { customer, reservations });
});


module.exports = router;
