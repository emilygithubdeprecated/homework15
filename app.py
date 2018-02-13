# import necessary libraries
import numpy as np

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
import pandas as pd

engine=create_engine("sqlite:///DataSets/belly_button_biodiversity.sqlite")

session=Session(bind=engine)

Base = automap_base()

Base.prepare(engine, reflect=True)

Samples = Base.classes.samples
Metadata = Base.classes.samples_metadata
OTU = Base.classes.otu


# create route that renders index.html template
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/names")
def names():
    samples_query = session.query(Samples)
    samples = pd.read_sql(samples_query.statement, samples_query.session.bind)
    names=list()
    for i in samples.to_dict().keys():
        names.append(i)
    names=names[1:]
    return(jsonify(names))    

@app.route("/otu")
def otu():
    otu_query = session.query(OTU)
    otu = pd.read_sql(otu_query.statement, otu_query.session.bind)
    descriptions=otu.lowest_taxonomic_unit_found
    return(jsonify(descriptions.to_dict()))  

@app.route("/metadata/<sample>")
def metadata(sample):
    sampleID=int(sample.split("_")[1])
    metadata_query = session.query(Metadata).filter(Metadata.SAMPLEID==sampleID)
    metadata = pd.read_sql(metadata_query.statement, metadata_query.session.bind)
    return(jsonify(metadata.to_dict()))   

@app.route("/wfreq/<sample>")
def wfreq(sample):
    sampleID=int(sample.split("_")[1])
    wfreq_query = session.query(Metadata).filter(Metadata.SAMPLEID==sampleID)
    wfreq = int(pd.read_sql(wfreq_query.statement, wfreq_query.session.bind)['WFREQ'])
    return(jsonify(wfreq))

@app.route("/samples/<sample>")
def samples(sample):
    samples_query = session.query(Samples)
    all_samples = pd.read_sql(samples_query.statement, samples_query.session.bind)
    data=all_samples[['otu_id',sample]]
    data=data.loc[data[sample]>0]
    data.columns=['otu_id','samples']
    data=data.sort_values('samples',ascending=False)
    otu_ids=[]
    samples=[]
    for i in range(0,len(data)):
        otu_ids.append(str(data['otu_id'].iloc[i]))
        samples.append(str(data['samples'].iloc[i]))
    newdict={
        "otu_ids":otu_ids,
        "samples":samples
    }
    return(jsonify(newdict))


'''
@app.route("/api/v1.0/<start>")
def temps(start):

    start_dateobject=datetime.datetime.strptime(start, '%Y-%m-%d')
    start_newdate_object=datetime.datetime.date(start_dateobject-datetime.timedelta(days=365))

    temp_query = session.query(Measurements).filter(Measurements.date>=start_newdate_object).with_entities(Measurements.date, Measurements.tobs)
    df = pd.read_sql(temp_query.statement, temp_query.session.bind)
    TMIN=df['tobs'].min()
    TMAX=df['tobs'].max()
    TAVG=df['tobs'].mean()
    results=pd.DataFrame([TMIN,TMAX,TAVG])
    return jsonify(results.to_dict())
'''

if __name__ == "__main__":
    app.run(debug=True)
    raise NotImplementedError()
